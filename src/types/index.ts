export type Role = 'student' | 'staff' | 'admin';

export type Category = 'all' | 'breakfast' | 'meals' | 'snacks' | 'rolls_wraps' | 'beverages' | 'desserts';

export type DietaryType = 'veg' | 'non-veg' | 'egg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  dietary: DietaryType;
  calories: number;
  prepTimeMins: number;
  rating: number;
  ratingCount: number;
  image: string;
  isAvailable: boolean;
  isDailySpecial?: boolean;
  allergens?: string[];
  spiceLevel?: 1 | 2 | 3;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  spiceLevel?: 1 | 2 | 3;
  specialInstructions?: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'collected';

export type PaymentMethod = 'upi' | 'card' | 'counter' | 'campus_wallet';

export interface Order {
  id: string;
  tokenNumber: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  status: OrderStatus;
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_counter';
  createdAt: string;
  counterNumber: number;
  estimatedReadyTime: string;
}

export interface RushHourStatus {
  rushLevel: 'low' | 'moderate' | 'peak';
  averageWaitMins: number;
  activeOrdersCount: number;
  message: string;
}
