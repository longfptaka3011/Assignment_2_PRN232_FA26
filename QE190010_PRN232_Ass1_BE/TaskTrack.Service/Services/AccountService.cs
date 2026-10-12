using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Services;

public class AccountService : IAccountService
{
    private readonly ISystemAccountRepository _accountRepo;

    public AccountService(ISystemAccountRepository accountRepo)
    {
        _accountRepo = accountRepo;
    }

    public async Task<IEnumerable<AccountDto>> GetAllAsync()
    {
        var accounts = await _accountRepo.GetAllAsync();
        return accounts.Select(a => new AccountDto
        {
            AccountId = a.AccountId,
            FullName = a.FullName,
            Email = a.Email,
            Role = a.Role,
            CreatedDate = a.CreatedDate,
            CreatedTasksCount = a.CreatedTasks?.Count ?? 0
        });
    }

    public async Task<AccountDto?> GetByIdAsync(int id)
    {
        var a = await _accountRepo.GetByIdAsync(id);
        if (a == null) return null;

        return new AccountDto
        {
            AccountId = a.AccountId,
            FullName = a.FullName,
            Email = a.Email,
            Role = a.Role,
            CreatedDate = a.CreatedDate,
            CreatedTasksCount = a.CreatedTasks?.Count ?? 0
        };
    }

    public async Task<AccountDto?> UpdateAsync(int id, UpdateAccountDto dto)
    {
        var existing = await _accountRepo.GetByIdAsync(id);
        if (existing == null) return null;

        existing.FullName = dto.FullName.Trim();
        existing.Role = dto.Role;

        var updated = await _accountRepo.UpdateAsync(existing);
        if (updated == null) return null;

        return new AccountDto
        {
            AccountId = updated.AccountId,
            FullName = updated.FullName,
            Email = updated.Email,
            Role = updated.Role,
            CreatedDate = updated.CreatedDate,
            CreatedTasksCount = updated.CreatedTasks?.Count ?? 0
        };
    }

    public async Task<(bool Success, string? ErrorMessage)> DeleteAsync(int id)
    {
        var existing = await _accountRepo.GetByIdAsync(id);
        if (existing == null)
        {
            return (false, $"Account with ID {id} not found.");
        }

        // Enforce rule: Reject if the account has created any tasks
        var hasTasks = await _accountRepo.HasCreatedTasksAsync(id);
        if (hasTasks)
        {
            return (false, "Cannot delete account that has created tasks. Please reassign or remove associated tasks first.");
        }

        var deleted = await _accountRepo.DeleteAsync(id);
        return (deleted, deleted ? null : "Failed to delete account.");
    }
}
