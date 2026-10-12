using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public class AccountDto
{
    public int AccountId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public short Role { get; set; }
    public string RoleName => Role == 1 ? "Admin" : "Staff";
    public DateTime CreatedDate { get; set; }
    public int CreatedTasksCount { get; set; }
}

public class UpdateAccountDto
{
    [Required(ErrorMessage = "Full Name is required.")]
    [StringLength(100, ErrorMessage = "Full Name cannot exceed 100 characters.")]
    public string FullName { get; set; } = null!;

    [Range(0, 1, ErrorMessage = "Role must be 0 (Staff) or 1 (Admin).")]
    public short Role { get; set; }
}
