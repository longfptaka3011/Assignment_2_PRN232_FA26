using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public interface IAuthService
{
    Task<(bool Success, string? Error, AuthResponseDto? Response, bool IsConflict)> RegisterAsync(RegisterDto dto);
    Task<(bool Success, string? Error, AuthResponseDto? Response)> LoginAsync(LoginDto dto);
    Task<AccountDto?> GetCurrentUserAsync(int accountId);
}
