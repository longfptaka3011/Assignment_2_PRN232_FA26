using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface ISystemAccountRepository
{
    Task<IEnumerable<SystemAccount>> GetAllAsync();
    Task<SystemAccount?> GetByIdAsync(int id);
    Task<SystemAccount?> GetByEmailAsync(string email);
    Task<SystemAccount> CreateAsync(SystemAccount account);
    Task<SystemAccount?> UpdateAsync(SystemAccount account);
    Task<bool> DeleteAsync(int id);
    Task<bool> HasCreatedTasksAsync(int accountId);
    Task<bool> EmailExistsAsync(string email);
}
