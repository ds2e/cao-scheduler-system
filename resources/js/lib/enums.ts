
// WARNING: Must be in sync to Role Enum from laravel
// CURRENTLY REDUNDANT ???
export enum UserRoles {
    Guest = 'Guest', // Placeholder - since DB start with index 1
    Mitarbeiter = 'Mitarbeiter',
    Moderator = 'Moderator',
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin'
};

export enum TaskCategoriesColor{
    None = 'white',
    Bar = 'blue-900',
    Küche = 'yellow-900',
    Service = 'red-900',
    Springer = 'green-900',
    Sonstiges = 'gray-900'
}

export const TaskCategoryKeys = Object.keys(TaskCategoriesColor);