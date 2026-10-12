using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Services;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    /// <summary>
    /// List all system accounts (Admin only)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetAll()
    {
        var accounts = await _accountService.GetAllAsync();
        return Ok(accounts);
    }

    /// <summary>
    /// Get an account by ID (Admin only)
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AccountDto>> GetById(int id)
    {
        var account = await _accountService.GetByIdAsync(id);
        if (account == null)
            return NotFound(new { message = $"Account with ID {id} not found." });

        return Ok(account);
    }

    /// <summary>
    /// Update account full name or role (Admin only)
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AccountDto>> Update(int id, [FromBody] UpdateAccountDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _accountService.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new { message = $"Account with ID {id} not found." });

        return Ok(updated);
    }

    /// <summary>
    /// Delete an account (Admin only - must be rejected if account created any tasks)
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, error) = await _accountService.DeleteAsync(id);

        if (!success)
        {
            if (error?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true)
            {
                return NotFound(new { message = error });
            }

            return BadRequest(new { message = error });
        }

        return NoContent();
    }
}
