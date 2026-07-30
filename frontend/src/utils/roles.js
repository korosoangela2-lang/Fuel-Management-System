export const ADMIN_ROLES = ["super_admin", "regional_admin"];
export const CUSTOMER_ROLES = ["user"];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function homeRouteFor(role) {
  return isAdminRole(role) ? "/admin/dashboard" : "/dashboard";
}
