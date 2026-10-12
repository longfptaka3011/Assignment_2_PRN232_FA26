// Department Types
export interface Department {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
  projects?: Project[];
}

export interface CreateDepartmentDto {
  departmentName: string;
  departmentDescription: string;
}

export interface UpdateDepartmentDto {
  departmentName: string;
  departmentDescription: string;
}

// Project Types
export interface Project {
  projectId: number;
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: number;
  statusName: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  createdDate: string;
  tasks?: Task[];
}

export interface CreateProjectDto {
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: number;
  departmentId: number;
}

export interface UpdateProjectDto {
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: number;
  departmentId: number;
}

// Task Types
export interface Task {
  taskId: number;
  title: string;
  description?: string;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  dueDate?: string;
  projectId: number;
  projectName?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  createdById?: number;
  createdByName?: string;
  tags?: Tag[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: number;
  priority: number;
  dueDate?: string;
  projectId: number;
  tagIds?: number[];
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  status: number;
  priority: number;
  dueDate?: string;
  projectId: number;
  tagIds?: number[];
}

// Tag Types
export interface Tag {
  tagId: number;
  tagName: string;
  color?: string;
}

export interface CreateTagDto {
  tagName: string;
  color?: string;
}

export interface UpdateTagDto {
  tagName: string;
  color?: string;
}

// Authentication & User Types
export interface User {
  accountId: number;
  fullName: string;
  email: string;
  role: number; // 0 = Staff, 1 = Admin
  roleName: 'Admin' | 'Staff' | string;
}

export interface AuthResponse {
  token: string;
  accountId: number;
  fullName: string;
  email: string;
  role: number;
  roleName: string;
  expiration?: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// Account Management Types (Admin only)
export interface SystemAccount {
  accountId: number;
  fullName: string;
  email: string;
  role: number;
  roleName: string;
  createdDate: string;
  createdTasksCount: number;
}

export interface UpdateAccountDto {
  fullName: string;
  role: number;
}
