import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import type { Order } from "../types";

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { orders, isLoading, error, refetch: fetch };
}
