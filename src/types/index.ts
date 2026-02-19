export type UserRole = 'guest' | 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  scheduledAt: Date;
  estimatedDistance: number;
  estimatedDuration: number;
  itemCount: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  quotePrice: number;
  lockedPrice?: number;
  priceLockFee?: number;
  finalPrice?: number;
  serviceType: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  distanceKm: number;
  estimatedDurationMinutes: number;
  basePrice: number;
  distancePrice: number;
  volumePrice: number;
  totalPrice: number;
  currency: string;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  insuranceExpiry: Date;
  rating: number;
  completedJobs: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmed' | 'driver_assigned' | 'en_route' | 'completed' | 'payment_receipt';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface CarbonOffset {
  id: string;
  bookingId: string;
  distanceKm: number;
  estimatedCO2g: number;
  offsetAmount: number;
  currency: string;
  provider: 'ecologi';
  transactionId?: string;
  createdAt: Date;
}
