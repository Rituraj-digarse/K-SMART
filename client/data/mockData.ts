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

export const currentToken = {
  id: "token-001",
  centreId: "centre-01",
  requestedDate: "21 Mar 2024",
  expectedQuantity: 40,
  status: "Approved" as const,
};

export const procurementRecords = [
  { id: "record-01", date: "14 Mar 2024", centre: "Sehore Mandi Procurement Centre", quantity: 45, amount: 102375, paymentStatus: "Paid" },
  { id: "record-02", date: "08 Mar 2024", centre: "Sehore Mandi Procurement Centre", quantity: 35, amount: 79625, paymentStatus: "Payment Pending" },
];

export const notifications = [
  { channel: "WhatsApp", title: "Token approved", message: "You can come now on 21 Mar 2024.", time: "Today, 09:42 AM", unread: true },
  { channel: "SMS", title: "Payment initiated", message: "Payment for 45 q wheat is on its way.", time: "Yesterday, 06:18 PM", unread: false },
  { channel: "In-App", title: "Slot successfully booked", message: "Your slot is valid until 26 Mar 2024.", time: "18 Mar 2024, 11:05 AM", unread: false },
];
