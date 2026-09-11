export const farmers = [
  { id: "farmer-001", mobile: "9876543210", name: "Ramesh Kumar", role: "farmer" as const },
  { id: "farmer-002", mobile: "9123456789", name: "Sita Bai", role: "farmer" as const },
];

export const staffCredentials = {
  admin: [{ id: "ADM1001", password: "admin123", name: "District Administrator" }],
  officer: [{ id: "240501", password: "officer123", name: "Procurement Officer" }],
  operator: [{ id: "240701", password: "operator123", name: "Centre Operator" }],
};

export const farmer = {
  id: "farmer-001",
  kisaanCode: "KIS-24-05821",
  name: "Ramesh Kumar",
  mobile: "+91 98XXXXXX42",
  district: "Sehore",
  tehsil: "Ashta",
  verifiedLandArea: 8.5,
  crop: "Wheat",
  season: "Rabi 2024-25",
};

export const govPolicy = {
  crop: "Wheat",
  season: "Rabi 2024-25",
  msp: 2275,
  procurementLimitPerAcre: 20,
  procurementPeriodStart: "2024-03-01",
  procurementPeriodEnd: "2024-05-31",
};

export const centres = [
  { id: "centre-01", name: "Sehore Mandi Procurement Centre", district: "Sehore", tehsil: "Sehore", address: "Mandi Road, Sehore", distance: 4.2, dailyWeighingCapacity: 500, usedDailyCapacity: 420, warehouseCapacity: 1200, reservedWarehouseCapacity: 860 },
  { id: "centre-02", name: "Ashta Cooperative Centre", district: "Sehore", tehsil: "Ashta", address: "Old Bus Stand, Ashta", distance: 11.8, dailyWeighingCapacity: 350, usedDailyCapacity: 190, warehouseCapacity: 800, reservedWarehouseCapacity: 410 },
];

export const activeSlot = {
  id: "slot-001",
  centreId: "centre-01",
  intendedQuantity: 80,
  startDate: "18 Mar 2024",
  endDate: "26 Mar 2024",
  daysRemaining: 6,
  status: "Active" as const,
};

export type TokenStatus = "Waiting for Approval" | "Approved" | "Long Queue Ahead" | "Cancelled" | "No-show" | "Completed";

export const tokens = [
  { id: "token-001", tokenNumber: "TKN-centre-01-2024-03-21-0452", shortReference: "T-0452", slotId: "slot-001", farmerId: "farmer-001", centreId: "centre-01", requestedDate: "21 Mar 2024", expectedQuantity: 40, status: "Approved" as TokenStatus, batchId: "batch-001", createdAt: "20 Mar 2024, 09:30 AM", approvedAt: "20 Mar 2024, 02:10 PM", completedAt: null },
  { id: "token-002", tokenNumber: "TKN-centre-01-2024-03-21-0453", shortReference: "T-0453", slotId: "slot-002", farmerId: "farmer-002", centreId: "centre-01", requestedDate: "21 Mar 2024", expectedQuantity: 55, status: "Waiting for Approval" as TokenStatus, batchId: null, createdAt: "20 Mar 2024, 10:15 AM", approvedAt: null, completedAt: null },
];

export const currentToken = tokens[0];

export const payments = [
  { id: "payment-01", procurementRecordId: "record-01", farmerId: "farmer-001", centreId: "centre-01", actualQuantity: 45, msp: 2275, amount: 102375, status: "Paid" as const, date: "14 Mar 2024" },
  { id: "payment-02", procurementRecordId: "record-02", farmerId: "farmer-001", centreId: "centre-01", actualQuantity: 35, msp: 2275, amount: 79625, status: "Payment Pending" as const, date: "08 Mar 2024" },
];

export const procurementRecords = [
  { id: "record-01", date: "14 Mar 2024", centre: "Sehore Mandi Procurement Centre", quantity: 45, amount: 102375, paymentStatus: "Paid" },
  { id: "record-02", date: "08 Mar 2024", centre: "Sehore Mandi Procurement Centre", quantity: 35, amount: 79625, paymentStatus: "Payment Pending" },
];

export const notifications = [
  { channel: "WhatsApp", title: "Token approved", message: "You can come now on 21 Mar 2024.", time: "Today, 09:42 AM", unread: true },
  { channel: "SMS", title: "Payment initiated", message: "Payment for 45 q wheat is on its way.", time: "Yesterday, 06:18 PM", unread: false },
  { channel: "In-App", title: "Slot successfully booked", message: "Your slot is valid until 26 Mar 2024.", time: "18 Mar 2024, 11:05 AM", unread: false },
];
