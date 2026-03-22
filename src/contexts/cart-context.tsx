import { createContext, useState, useEffect } from "react";
import type { Service } from "../themes/types";

interface CartContextType {
  items: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearCart: () => void;
  hasService: (serviceId: string) => boolean;
  total: number;
  totalDuration: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const key = `vb_cart_${slug}`;

  const [items, setItems] = useState<Service[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  function addService(service: Service) {
    setItems(prev =>
      prev.find(s => s.id === service.id) ? prev : [...prev, service],
    );
  }

  function removeService(serviceId: string) {
    setItems(prev => prev.filter(s => s.id !== serviceId));
  }

  function clearCart() {
    setItems([]);
  }

  function hasService(serviceId: string) {
    return items.some(s => s.id === serviceId);
  }

  const total = items.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const totalDuration = items.reduce(
    (sum, s) => sum + (s.duration_min ?? 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, addService, removeService, clearCart, hasService, total, totalDuration }}
    >
      {children}
    </CartContext.Provider>
  );
}
