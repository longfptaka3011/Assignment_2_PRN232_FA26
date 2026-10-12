using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public class AuthService : IAuthService
{
    private readonly ISystemAccountRepository _accountRepo;
    private readonly IConfiguration _configuration;

    public AuthService(ISystemAccountRepository accountRepo, IConfiguration configuration)
    {
        _accountRepo = accountRepo;
        _configuration = configuration;
    }

    public async Task<(bool Success, string? Error, AuthResponseDto? Response, bool IsConflict)> RegisterAsync(RegisterDto dto)
    {
        var emailNormalized = dto.Email.Trim().ToLower();

        if (await _accountRepo.EmailExistsAsync(emailNormalized))
        {
            return (false, $"An account with email '{dto.Email}' already exists.", null, true);
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var newAccount = new SystemAccount
        {
            FullName = dto.FullName.Trim(),
            Email = emailNormalized,
            PasswordHash = passwordHash,
            Role = 0, // Enforce Staff role only
            CreatedDate = DateTime.UtcNow
        };

        var created = await _accountRepo.CreateAsync(newAccount);
        var token = GenerateJwtToken(created, out var expires);

        var response = new AuthResponseDto
        {
            Token = token,
            AccountId = created.AccountId,
            FullName = created.FullName,
            Email = created.Email,
            Role = created.Role,
            RoleName = "Staff",
            Expiration = expires
        };

        return (true, null, response, false);
    }

    public async Task<(bool Success, string? Error, AuthResponseDto? Response)> LoginAsync(LoginDto dto)
    {
        var emailNormalized = dto.Email.Trim().ToLower();
        var account = await _accountRepo.GetByEmailAsync(emailNormalized);

        if (account == null || !BCrypt.Net.BCrypt.Verify(dto.Password, account.PasswordHash))
        {
            return (false, "Invalid email or password.", null);
        }

        var token = GenerateJwtToken(account, out var expires);

        var response = new AuthResponseDto
        {
            Token = token,
            AccountId = account.AccountId,
            FullName = account.FullName,
            Email = account.Email,
            Role = account.Role,
            RoleName = account.Role == 1 ? "Admin" : "Staff",
            Expiration = expires
        };

        return (true, null, response);
    }

    public async Task<AccountDto?> GetCurrentUserAsync(int accountId)
    {
        var account = await _accountRepo.GetByIdAsync(accountId);
        if (account == null) return null;

        return new AccountDto
        {
            AccountId = account.AccountId,
            FullName = account.FullName,
            Email = account.Email,
            Role = account.Role,
            CreatedDate = account.CreatedDate,
            CreatedTasksCount = account.CreatedTasks?.Count ?? 0
        };
    }

    private string GenerateJwtToken(SystemAccount account, out DateTime expires)
    {
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? _configuration["Jwt:Key"]
            ?? "PRN232_TaskTrack_Super_Secure_Secret_Key_2026_FA26_JWT_Token_Auth!";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        expires = DateTime.UtcNow.AddHours(24);

        var roleName = account.Role == 1 ? "Admin" : "Staff";

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.AccountId.ToString()),
            new Claim(ClaimTypes.Email, account.Email),
            new Claim(ClaimTypes.Name, account.FullName),
            new Claim(ClaimTypes.Role, roleName),
            new Claim("accountId", account.AccountId.ToString()),
            new Claim("role", account.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
