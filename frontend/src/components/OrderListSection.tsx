import type { Order } from "../types";
import SectionCard from "./SectionCard";

interface OrderRowProps {
  order: Order;
}

function OrderRow({ order }: OrderRowProps) {
  return (
    <tr>
      <td className="table-cell">#{order.id}</td>
      <td className="table-cell">
        {order.patient_first_name} {order.patient_last_name}
      </td>
      <td className="table-cell">{order.patient_date_of_birth}</td>
      <td className="table-cell table-cell--muted">
        {order.source_filename ?? "—"}
      </td>
    </tr>
  );
}

interface OrderListSectionProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export default function OrderListSection({
  orders,
  isLoading,
  error,
}: OrderListSectionProps) {
  return (
    <SectionCard number="3" title="Orders">
      {isLoading ? (
        <div className="empty-state">Loading orders…</div>
      ) : error ? (
        <div className="empty-state" style={{ color: "var(--color-error-text)" }}>
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          No orders yet — upload a document to create one.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Patient Name</th>
                <th className="table-header">Date of Birth</th>
                <th className="table-header">Source File</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
