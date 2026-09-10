import { useState } from "react";
import { updateOrder } from "../api/orders";
import { useOrders } from "../hooks/useOrders";
import { useUpload } from "../hooks/useUpload";
import ExtractedInfoSection from "../components/ExtractedInfoSection";
import OrderListSection from "../components/OrderListSection";
import UploadSection from "../components/UploadSection";
import type { OrderUpdatePayload } from "../types";

export default function OrderIntakePage() {
  const { orders, isLoading, error, refetch } = useOrders();
  const { upload, status, feedback, dismissFeedback, order, replaceOrder } =
    useUpload(refetch);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(payload: OrderUpdatePayload) {
    if (!order) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const updated = await updateOrder(order.id, payload);
      replaceOrder(updated);
      refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Patient Order Intake</h1>
      <div className="sections">
        <UploadSection
          onUpload={upload}
          status={status}
          feedback={feedback}
          onDismissFeedback={dismissFeedback}
        />
        <ExtractedInfoSection
          data={order}
          onSave={handleSave}
          isSaving={isSaving}
          saveError={saveError}
          onDismissSaveError={() => setSaveError(null)}
        />
        <OrderListSection orders={orders} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
