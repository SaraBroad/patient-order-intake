import { useOrders } from "../hooks/useOrders";
import { useUpload } from "../hooks/useUpload";
import ExtractedInfoSection from "../components/ExtractedInfoSection";
import OrderListSection from "../components/OrderListSection";
import UploadSection from "../components/UploadSection";

export default function OrderIntakePage() {
  const { orders, isLoading, error, refetch } = useOrders();
  const { upload, status, feedback, dismissFeedback, order } = useUpload(refetch);

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
        <ExtractedInfoSection data={order} />
        <OrderListSection orders={orders} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
