import type { Role } from "@/context/AuthContext";

export const permissions = {
  officer: {
    canViewTokenQueue: true,
    canApproveTokens: true,
    canRejectCancelTokens: true,
    canMarkLongQueueAhead: true,
    canFormBatches: true,
    canEditDailyCapacity: true,
    canEditWarehouseCapacity: true,
    canViewCapacityAnalytics: true,
    canViewAllCentreTokens: true,
    canEnterReceiptQuantity: false,
    canConfirmPayment: false,
    canTriggerOTP: false,
    canAccessKisaanCodeLookup: false,
    canConfigurePolicyOrMSP: false,
    canReleasePayment: false,
  },
  operator: {
    canAccessKisaanCodeLookup: true,
    canEnterReceiptQuantity: true,
    canConfirmPayment: true,
    canTriggerOTP: true,
    canViewCompletedRecords: true,
    canViewTokenQueue: false,
    canApproveTokens: false,
    canRejectCancelTokens: false,
    canFormBatches: false,
    canEditDailyCapacity: false,
    canEditWarehouseCapacity: false,
    canConfigurePolicyOrMSP: false,
    canReleasePayment: false,
  },
  admin: {},
  farmer: {},
} as const;

export type StaffPermission = keyof typeof permissions.officer;

export function hasPermission(role: Role | undefined, permission: StaffPermission) {
  return role === "officer" && permissions.officer[permission] === true || role === "operator" && permissions.operator[permission] === true;
}
