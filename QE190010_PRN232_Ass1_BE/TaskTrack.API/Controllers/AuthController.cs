using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Services;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new Staff account (Public - no token required)
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, error, response, isConflict) = await _authService.RegisterAsync(dto);

        if (isConflict)
        {
            return Conflict(new { message = error });
        }

        if (!success || response == null)
        {
            return BadRequest(new { message = error });
        }

        return StatusCode(StatusCodes.Status201Created, response);
    }

    /// <summary>
    /// Validate email + password and obtain signed JWT token (Public - no token required)
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, error, response) = await _authService.LoginAsync(dto);

        if (!success || response == null)
        {
            return Unauthorized(new { message = error ?? "Invalid email or password." });
        }

        return Ok(response);
    }

    /// <summary>
    /// Get current logged-in user profile (Requires valid JWT token)
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AccountDto>> GetCurrentUser()
    {
        var accountIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("accountId");

        if (string.IsNullOrEmpty(accountIdClaim) || !int.TryParse(accountIdClaim, out var accountId))
        {
            return Unauthorized(new { message = "Invalid token identity." });
        }

        var account = await _authService.GetCurrentUserAsync(accountId);
        if (account == null)
        {
            return NotFound(new { message = "User account not found." });
        }

        return Ok(account);
    }
}
