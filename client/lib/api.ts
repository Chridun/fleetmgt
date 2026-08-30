import { getApiUrl } from "./query-client";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(endpoint, getApiUrl()).toString();
  
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Organizations
export const organizationsApi = {
  getAll: () => apiRequest<any[]>("/api/organizations"),
  get: (id: string) => apiRequest<any>(`/api/organizations/${id}`),
  create: (data: any) => apiRequest<any>("/api/organizations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/organizations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<any>(`/api/organizations/${id}`, { method: "DELETE" }),
};

// Users
export const usersApi = {
  getAll: (params?: { role?: string; organizationId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set("role", params.role);
    if (params?.organizationId) searchParams.set("organizationId", params.organizationId);
    return apiRequest<any[]>(`/api/users?${searchParams}`);
  },
  get: (id: string) => apiRequest<any>(`/api/users/${id}`),
  create: (data: any) => apiRequest<any>("/api/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/users/${id}`, { method: "DELETE" }),
  setStatus: (id: string, isActive: boolean) => 
    apiRequest<any>(`/api/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
  changePassword: (currentPassword: string, newPassword: string) => 
    apiRequest<any>("/api/users/change-password", { 
      method: "POST", 
      body: JSON.stringify({ currentPassword, newPassword }) 
    }),
};

// Trucks
export const trucksApi = {
  getAll: (organizationId?: string) => {
    const params = organizationId ? `?organizationId=${organizationId}` : "";
    return apiRequest<any[]>(`/api/trucks${params}`);
  },
  get: (id: string) => apiRequest<any>(`/api/trucks/${id}`),
  create: (data: any) => apiRequest<any>("/api/trucks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/trucks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/trucks/${id}`, { method: "DELETE" }),
  getHelpers: (truckId: string) => apiRequest<any[]>(`/api/trucks/${truckId}/helpers`),
  addHelper: (truckId: string, helperId: string) => apiRequest<any>(`/api/trucks/${truckId}/helpers`, { method: "POST", body: JSON.stringify({ helperId }) }),
  removeHelper: (truckId: string, helperId: string) => apiRequest<void>(`/api/trucks/${truckId}/helpers/${helperId}`, { method: "DELETE" }),
  getNotes: (truckId: string) => apiRequest<any[]>(`/api/trucks/${truckId}/notes`),
  addNote: (truckId: string, content: string) => apiRequest<any>(`/api/trucks/${truckId}/notes`, { method: "POST", body: JSON.stringify({ content, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }) }),
};

// Permits
export const permitsApi = {
  getByTruck: (truckId: string) => apiRequest<any[]>(`/api/trucks/${truckId}/permits`),
  create: (data: any) => apiRequest<any>("/api/permits", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/permits/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/permits/${id}`, { method: "DELETE" }),
};

// Reminders
export const remindersApi = {
  getUpcoming: () => apiRequest<any[]>("/api/reminders/upcoming"),
};

// Staff Licenses
export const licensesApi = {
  getByUser: (userId: string) => apiRequest<any[]>(`/api/users/${userId}/licenses`),
  create: (data: any) => apiRequest<any>("/api/licenses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/licenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/licenses/${id}`, { method: "DELETE" }),
};

// Tasks
export const tasksApi = {
  getAll: () => apiRequest<any[]>("/api/tasks"),
  create: (data: any) => apiRequest<any>("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};

function getClientDateInfo() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return { timezone: tz, clientDate: `${year}-${month}-${day}` };
}

// Attendance
export const attendanceApi = {
  getAll: (params?: { userId?: string; startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.set("userId", params.userId);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    return apiRequest<any[]>(`/api/attendance?${searchParams}`);
  },
  getToday: () => {
    const { clientDate } = getClientDateInfo();
    return apiRequest<any>(`/api/attendance/today?clientDate=${clientDate}`);
  },
  checkIn: (location?: { latitude: number; longitude: number } | null, note?: string) => {
    const { timezone, clientDate } = getClientDateInfo();
    return apiRequest<any>("/api/attendance/check-in", { 
      method: "POST", 
      body: JSON.stringify({ timezone, clientDate, latitude: location?.latitude, longitude: location?.longitude, note: note || null }),
      headers: { "Content-Type": "application/json" },
    });
  },
  checkOut: (location?: { latitude: number; longitude: number } | null, note?: string) => {
    const { timezone, clientDate } = getClientDateInfo();
    return apiRequest<any>("/api/attendance/check-out", { 
      method: "POST", 
      body: JSON.stringify({ timezone, clientDate, latitude: location?.latitude, longitude: location?.longitude, note: note || null }),
      headers: { "Content-Type": "application/json" },
    });
  },
  updateNotes: (id: string, data: { checkInNote?: string | null; checkOutNote?: string | null }) =>
    apiRequest<any>(`/api/attendance/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
  getCheckedIn: () => {
    const { clientDate } = getClientDateInfo();
    return apiRequest<any[]>(`/api/attendance/checked-in?clientDate=${clientDate}`);
  },
};

// IOU Requests
export const iouApi = {
  getAll: () => apiRequest<any[]>("/api/iou-requests"),
  create: (data: { amount: number; reason?: string }) => {
    const { timezone } = getClientDateInfo();
    return apiRequest<any>("/api/iou-requests", { method: "POST", body: JSON.stringify({ ...data, timezone }) });
  },
  update: (id: string, status: string) => 
    apiRequest<any>(`/api/iou-requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// Day Off Requests
export const dayOffApi = {
  getAll: () => apiRequest<any[]>("/api/day-off-requests"),
  create: (data: { startDate: string; endDate: string; reason?: string }) => {
    const { timezone } = getClientDateInfo();
    return apiRequest<any>("/api/day-off-requests", { method: "POST", body: JSON.stringify({ ...data, timezone }) });
  },
  update: (id: string, status: string) => 
    apiRequest<any>(`/api/day-off-requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// Pending Approvals
export const approvalsApi = {
  getPendingCount: () => apiRequest<{
    count: number;
    iouCount: number;
    dayOffCount: number;
    profileEditCount: number;
    flaggedCount: number;
  }>("/api/pending-approvals-count"),
};

// Flagged Attendance
export const flaggedAttendanceApi = {
  getAll: () => apiRequest<any[]>("/api/flagged-attendance"),
  resolve: (id: string, data: { checkOutTime: string; hoursWorked?: string }) =>
    apiRequest<any>(`/api/flagged-attendance/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  manualResolve: (id: string, data: { checkOutTime: string; hoursWorked?: string }) =>
    apiRequest<any>(`/api/attendance/${id}/manual-resolve`, { method: "POST", body: JSON.stringify(data) }),
};

// Profile Edit Requests
export const profileEditApi = {
  getAll: () => apiRequest<any[]>("/api/profile-edit-requests"),
  create: (data: { fieldName: string; oldValue: string | null; newValue: string }) => 
    apiRequest<any>("/api/profile-edit-requests", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, status: string) => 
    apiRequest<any>(`/api/profile-edit-requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// Pay Calculation
export const payApi = {
  calculate: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : "";
    return apiRequest<{
      daysWorked: number;
      totalHours: string;
      amountDue: string;
      payPeriodStart: string;
      payPeriodEnd: string;
      nextPayDate: string;
    }>(`/api/pay/calculate${params}`);
  },
};

// Fuel Logs
export const fuelApi = {
  getAssignedTruck: () => apiRequest<any>("/api/fuel-logs/assigned-truck"),
  getMyLogs: () => apiRequest<any[]>("/api/fuel-logs/my-logs"),
  create: (data: { truckId: string; fuelQuantity: number; amountPaid: number; odometerReading: number; timezone?: string }) =>
    apiRequest<any>("/api/fuel-logs", { method: "POST", body: JSON.stringify(data) }),
  getByOrganization: (orgId: string) => apiRequest<any[]>(`/api/fuel-logs/organization/${orgId}`),
  getByTruck: (truckId: string) => apiRequest<any[]>(`/api/fuel-logs/truck/${truckId}`),
  createAsTrucker: (data: { truckId: string; fuelQuantity: number; amountPaid: number; odometerReading: number; timezone?: string }) =>
    apiRequest<any>("/api/fuel-logs/trucker", { method: "POST", body: JSON.stringify(data) }),
  getAnalytics: (orgId: string, period: "week" | "month" | "year" = "month") =>
    apiRequest<{
      summary: { totalFuel: string; totalCost: string; avgCostPerUnit: string; logCount: number };
      chartData: { date: string; fuel: number; cost: number; count: number }[];
      logs: any[];
    }>(`/api/fuel-logs/analytics/${orgId}?period=${period}`),
  getTruckAnalytics: (truckId: string, period: "week" | "month" | "year" = "month") =>
    apiRequest<{
      summary: { totalFuel: string; totalCost: string; avgCostPerUnit: string; logCount: number };
      chartData: { date: string; fuel: number; cost: number; count: number }[];
      logs: any[];
    }>(`/api/fuel-logs/analytics/truck/${truckId}?period=${period}`),
};
