export const ROLES = {
  USER: "USER",
  MEMBER: "MEMBER",
  COREMEMBER: "COREMEMBER",
  VICEPRESIDENT: "VICEPRESIDENT",
  PRESIDENT: "PRESIDENT",
  ADMIN: "ADMIN"
};

export const ROLE_HIERARCHY = {
  [ROLES.USER]: 0,
  [ROLES.MEMBER]: 1,
  [ROLES.COREMEMBER]: 2,
  [ROLES.VICEPRESIDENT]: 3,
  [ROLES.PRESIDENT]: 4,
  [ROLES.ADMIN]: 5
};

export const hasMinimumRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};