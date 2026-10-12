using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class SystemAccountRepository : ISystemAccountRepository
{
    private readonly TaskTrackDbContext _context;

    public SystemAccountRepository(TaskTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SystemAccount>> GetAllAsync()
    {
        return await _context.SystemAccounts
            .Include(a => a.CreatedTasks)
            .OrderBy(a => a.AccountId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<SystemAccount?> GetByIdAsync(int id)
    {
        return await _context.SystemAccounts
            .Include(a => a.CreatedTasks)
            .FirstOrDefaultAsync(a => a.AccountId == id);
    }

    public async Task<SystemAccount?> GetByEmailAsync(string email)
    {
        return await _context.SystemAccounts
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email.Trim().ToLower());
    }

    public async Task<SystemAccount> CreateAsync(SystemAccount account)
    {
        account.CreatedDate = DateTime.UtcNow;
        _context.SystemAccounts.Add(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<SystemAccount?> UpdateAsync(SystemAccount account)
    {
        var existing = await _context.SystemAccounts.FindAsync(account.AccountId);
        if (existing == null)
            return null;

        existing.FullName = account.FullName;
        existing.Role = account.Role;
        if (!string.IsNullOrEmpty(account.PasswordHash))
        {
            existing.PasswordHash = account.PasswordHash;
        }

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var account = await _context.SystemAccounts.FindAsync(id);
        if (account == null)
            return false;

        _context.SystemAccounts.Remove(account);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> HasCreatedTasksAsync(int accountId)
    {
        return await _context.Tasks.AnyAsync(t => t.CreatedById == accountId);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.SystemAccounts
            .AnyAsync(a => a.Email.ToLower() == email.Trim().ToLower());
    }
}
