
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
    None = 'bg-white',
    Bar = 'bg-blue-900',
    Küche = 'bg-yellow-900',
    Service = 'bg-red-900',
    Springer = 'bg-green-900',
    Sonstiges = 'bg-gray-900'
}

export const TaskCategoryKeys = Object.keys(TaskCategoriesColor);