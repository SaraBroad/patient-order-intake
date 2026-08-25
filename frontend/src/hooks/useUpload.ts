import { useState } from "react";
import { uploadOrder } from "../api/orders";
import type { Feedback, Order, UploadStatus } from "../types";

interface UseUploadReturn {
  upload: (file: File | null, clientSideError?: string) => Promise<void>;
  status: UploadStatus;
  feedback: Feedback | null;
  dismissFeedback: () => void;
  order: Order | null;
}

export function useUpload(onSuccess?: () => void): UseUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  async function upload(file: File | null, clientSideError?: string) {
    if (clientSideError) {
      setFeedback({ variant: "error", message: clientSideError });
      setOrder(null);
      return;
    }
    if (!file) return;

    setOrder(null);
    setStatus("uploading");
    setFeedback(null);

    try {
      const result = await uploadOrder(file);
      setOrder(result);
      setStatus("success");
      setFeedback({
        variant: "success",
        message: "Extraction complete. Review the results below.",
      });
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setFeedback({
        variant: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  return {
    upload,
    status,
    feedback,
    dismissFeedback: () => setFeedback(null),
    order,
  };
}
