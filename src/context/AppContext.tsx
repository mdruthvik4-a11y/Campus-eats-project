import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, Role, PaymentMethod, RushHourStatus } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, RUSH_STATUS } from '../data/mockData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  studentTab: 'menu' | 'tracking' | 'history';
  setStudentTab: (tab: 'menu' | 'tracking' | 'history') => void;
  adminTab: 'analytics' | 'menu';
  setAdminTab: (tab: 'analytics' | 'menu') => void;

  // Menu management
  menuItems: MenuItem[];
  toggleItemAvailability: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, spiceLevel?: 1 | 2 | 3, notes?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  placeOrder: (pickupSlot: string, paymentMethod: PaymentMethod, customerName: string, customerPhone: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorder: (order: Order) => void;

  // Canteen Audio alerts
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playNotificationSound: () => void;

  // Rush status
  rushStatus: RushHourStatus;
  notificationMessage: string | null;
  dismissNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [studentTab, setStudentTab] = useState<'menu' | 'tracking' | 'history'>('menu');
  const [adminTab, setAdminTab] = useState<'analytics' | 'menu'>('analytics');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('campuseats_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('campuseats_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('ord-101');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rushStatus] = useState<RushHourStatus>(RUSH_STATUS);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist menu and orders to local storage
  useEffect(() => {
    localStorage.setItem('campuseats_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('campuseats_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Menu operations
  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const item: MenuItem = {
      ...newItem,
      id: `item-${Date.now()}`,
    };
    setMenuItems(prev => [item, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // Cart operations
  const addToCart = (item: MenuItem, quantity = 1, spiceLevel?: 1 | 2 | 3, notes?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(c => c.menuItem.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          spiceLevel: spiceLevel || next[existingIndex].spiceLevel,
          specialInstructions: notes || next[existingIndex].specialInstructions,
        };
        return next;
      }
      return [...prev, { menuItem: item, quantity, spiceLevel, specialInstructions: notes }];
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);

  // Web Audio simulated chime
  const playNotificationSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext may be restricted by autoplay policy
    }
  };

  // Orders operations
  const placeOrder = (
    pickupSlot: string,
    paymentMethod: PaymentMethod,
    customerName: string,
    customerPhone: string
  ): Order => {
    const nextTokenNum = Math.floor(100 + Math.random() * 900);
    const tokenLetter = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const tokenNumber = `${tokenLetter}-${nextTokenNum}`;
    const counterNumber = (Math.floor(Math.random() * 3) + 1);

    const taxes = Math.round(cartSubtotal * 0.05);
    const discount = cartSubtotal >= 200 ? 20 : 0;
    const total = cartSubtotal + taxes - discount;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Estimated ready time ~15 mins from now
    const readyDate = new Date(now.getTime() + 15 * 60000);
    const estimatedReadyTime = readyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tokenNumber,
      customerName: customerName.trim() || 'Student Customer',
      customerPhone: customerPhone.trim() || '+91 98765 43210',
      items: [...cart],
      subtotal: cartSubtotal,
      taxes,
      discount,
      total,
      status: 'placed',
      pickupSlot,
      paymentMethod,
      paymentStatus: paymentMethod === 'counter' ? 'pending_counter' : 'paid',
      createdAt: timeString,
      counterNumber,
      estimatedReadyTime,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveOrderId(newOrder.id);
    setStudentTab('tracking');

    // Trigger audio visual alert
    playNotificationSound();
    setNotificationMessage(`Order Confirmed! Token #${newOrder.tokenNumber} assigned at Counter ${counterNumber}.`);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            paymentStatus: newStatus === 'collected' ? 'paid' : order.paymentStatus,
          };
        }
        return order;
      })
    );

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      playNotificationSound();
      const statusLabels: Record<OrderStatus, string> = {
        placed: 'placed in queue',
        preparing: 'now being prepared in kitchen',
        ready: 'READY FOR PICKUP at Counter ' + targetOrder.counterNumber,
        collected: 'marked as collected',
      };
      setNotificationMessage(`Token #${targetOrder.tokenNumber} is ${statusLabels[newStatus]}!`);
    }
  };

  const reorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.menuItem, item.quantity, item.spiceLevel, item.specialInstructions);
    });
    setIsCartOpen(true);
    setStudentTab('menu');
  };

  const dismissNotification = () => {
    setNotificationMessage(null);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        studentTab,
        setStudentTab,
        adminTab,
        setAdminTab,
        menuItems,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        orders,
        activeOrderId,
        setActiveOrderId,
        placeOrder,
        updateOrderStatus,
        reorder,
        soundEnabled,
        setSoundEnabled,
        playNotificationSound,
        rushStatus,
        notificationMessage,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
