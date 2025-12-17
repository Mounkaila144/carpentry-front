/**
 * Users Module
 * Public API exports
 */

// Admin layer exports
export { UsersList } from '../UsersGuard/admin/components/UsersList';
export { useUsers } from '../UsersGuard/admin/hooks/useUsers';
export { userService } from '../UsersGuard/admin/services/userService';

// Type exports
export type { User, UserGroup, UserFilters, PaginationMeta } from '../UsersGuard/types/user.types';
