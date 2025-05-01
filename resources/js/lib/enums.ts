
// WARNING: Must be in sync to Role Enum from laravel 
export enum UserRoles {
    Guest = 'Guest', // since DB start with index 1
    User = 'User',
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin'
};