import type { AccessControlProvider } from "@refinedev/core";
import type { AdminRole } from "../types";

/**
 * Role-based access control matrix.
 * Maps each resource+action pair to the roles that are permitted.
 */
const PERMISSION_MATRIX: Record<string, readonly AdminRole[]> = {
  // Dashboard - everyone can view
  "dashboard:list": ["SUPER_ADMIN", "CONTENT_MANAGER", "SUPPORT_AGENT", "VIEWER"],

  // Users
  "users:list": ["SUPER_ADMIN", "SUPPORT_AGENT", "VIEWER"],
  "users:show": ["SUPER_ADMIN", "SUPPORT_AGENT", "VIEWER"],
  "users:edit": ["SUPER_ADMIN"],
  "users:delete": ["SUPER_ADMIN"],

  // Content
  "content:list": ["SUPER_ADMIN", "CONTENT_MANAGER", "VIEWER"],
  "content:show": ["SUPER_ADMIN", "CONTENT_MANAGER", "VIEWER"],
  "content:create": ["SUPER_ADMIN", "CONTENT_MANAGER"],
  "content:edit": ["SUPER_ADMIN", "CONTENT_MANAGER"],
  "content:delete": ["SUPER_ADMIN", "CONTENT_MANAGER"],

  // Notifications
  "notifications:list": ["SUPER_ADMIN", "SUPPORT_AGENT", "VIEWER"],
  "notifications:show": ["SUPER_ADMIN", "SUPPORT_AGENT"],
  "notifications:edit": ["SUPER_ADMIN"],

  // Feature Flags
  "feature-flags:list": ["SUPER_ADMIN", "VIEWER"],
  "feature-flags:show": ["SUPER_ADMIN", "VIEWER"],
  "feature-flags:create": ["SUPER_ADMIN"],
  "feature-flags:edit": ["SUPER_ADMIN"],
  "feature-flags:delete": ["SUPER_ADMIN"],

  // Analytics
  "analytics:list": ["SUPER_ADMIN", "VIEWER"],

  // Support
  "support:list": ["SUPER_ADMIN", "SUPPORT_AGENT"],
  "support:show": ["SUPER_ADMIN", "SUPPORT_AGENT"],
  "support:edit": ["SUPER_ADMIN", "SUPPORT_AGENT"],

  // Billing
  "billing:list": ["SUPER_ADMIN"],
  "billing:show": ["SUPER_ADMIN"],
  "billing:create": ["SUPER_ADMIN"],
  "billing:edit": ["SUPER_ADMIN"],
  "billing:delete": ["SUPER_ADMIN"],

  // Compliance
  "compliance:list": ["SUPER_ADMIN"],
  "compliance:show": ["SUPER_ADMIN"],
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // Retrieve role from localStorage (set during login)
    const raw = localStorage.getItem("unjynx_admin_user");
    let role: AdminRole = "VIEWER";

    if (raw) {
      try {
        const user = JSON.parse(raw);
        role = user.role ?? "VIEWER";
      } catch {
        // Fall through to VIEWER
      }
    }

    // SUPER_ADMIN bypasses all checks
    if (role === "SUPER_ADMIN") {
      return { can: true };
    }

    const key = `${resource}:${action}`;
    const allowedRoles = PERMISSION_MATRIX[key];

    if (!allowedRoles) {
      // If no rule defined, only SUPER_ADMIN
      return { can: false, reason: "Insufficient permissions" };
    }

    const allowed = allowedRoles.includes(role);

    return {
      can: allowed,
      reason: allowed ? undefined : "Insufficient permissions",
    };
  },
};
