import api from './api';

export interface ServiceRequest {
  id: string;
  customerId: string;
  pickupAddress: string;
  returnAddress: string;
  destinationAddress: string;
  pickupDatetime: string;
  maxReturnDatetime?: string;
  notes?: string;
  carModel: string;
  carPlateNumber: string;
  status: 'OPEN' | 'BIDDING' | 'DRIVER_SELECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  selectedDriverId?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string; phone: string };
  bids?: Bid[];
  payment?: Payment | null;
  review?: Review | null;
  _count?: { bids: number };
}

export interface Bid {
  id: string;
  requestId: string;
  driverId: string;
  price: number;
  estimatedReturnTime: string;
  message?: string;
  isSelected: boolean;
  createdAt: string;
  driver?: {
    id: string;
    name: string;
    driverProfile?: {
      ratingAvg: number;
      totalJobs: number;
      photoUrl?: string;
      verificationStatus: string;
    } | null;
  };
}

export interface Payment {
  id: string;
  requestId: string;
  amount: number;
  commissionAmount: number;
  driverAmount: number;
  status: string;
}

export interface Review {
  id: string;
  rating: number;
  reviewText?: string;
}

export async function createRequest(data: {
  pickupAddress: string;
  returnAddress: string;
  destinationAddress: string;
  pickupDatetime: string;
  maxReturnDatetime?: string;
  notes?: string;
  carModel: string;
  carPlateNumber: string;
}) {
  const res = await api.post('/requests', data);
  return res.data.data as ServiceRequest;
}

export async function getMyRequests() {
  const res = await api.get('/requests');
  return res.data.data as ServiceRequest[];
}

export async function getRequestById(id: string) {
  const res = await api.get(`/requests/${id}`);
  return res.data.data as ServiceRequest;
}

export async function cancelRequest(id: string) {
  const res = await api.delete(`/requests/${id}`);
  return res.data.data as ServiceRequest;
}

export async function selectDriver(requestId: string, bidId: string) {
  const res = await api.patch(`/requests/${requestId}/select-driver`, { bidId });
  return res.data.data;
}

export async function completeRequest(requestId: string) {
  const res = await api.patch(`/requests/${requestId}/complete`);
  return res.data.data as ServiceRequest;
}
