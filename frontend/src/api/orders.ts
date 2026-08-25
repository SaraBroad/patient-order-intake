import type { Order, OrderUpdatePayload } from "../types";
import client from "./client";

export function getOrders(): Promise<Order[]> {
  return client.get("/api/v1/orders/").then((res) => res.data as Order[]);
}

export function getOrder(orderId: number): Promise<Order> {
  return client
    .get(`/api/v1/orders/${orderId}`)
    .then((res) => res.data as Order);
}

export function uploadOrder(file: File): Promise<Order> {
  const formData = new FormData();
  formData.append("file", file);
  return client
    .post("/api/v1/orders/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data as Order);
}

export function updateOrder(
  orderId: number,
  payload: OrderUpdatePayload
): Promise<Order> {
  return client
    .patch(`/api/v1/orders/${orderId}`, payload)
    .then((res) => res.data as Order);
}
