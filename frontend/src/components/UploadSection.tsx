import { useRef, useState } from "react";
import type { Feedback, UploadStatus } from "../types";
import Alert from "./Alert";
import SectionCard from "./SectionCard";
import Spinner from "./Spinner";

const ACCEPTED_TYPE = "application/pdf";
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadSectionProps {
  onUpload: (file: File | null, clientSideError?: string) => void;
  status: UploadStatus;
  feedback: Feedback | null;
  onDismissFeedback: () => void;
}

export default function UploadSection({
  onUpload,
  status,
  feedback,
  onDismissFeedback,
}: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isProcessing = status === "uploading";

  function selectFile(selected: File | null) {
    if (!selected) return;
    if (selected.type !== ACCEPTED_TYPE) {
      onUpload(null, "Only PDF files are supported.");
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      onUpload(null, "File exceeds the 20 MB size limit.");
      return;
    }
    setFile(selected);
    onDismissFeedback();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    selectFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    selectFile(e.dataTransfer.files[0] ?? null);
  }

  function handleRemoveFile() {
    setFile(null);
    onDismissFeedback();
  }

  function handleSubmit() {
    if (file) onUpload(file);
  }

  return (
    <SectionCard number="1" title="Upload Document">
      <div
        className={[
          "upload-zone",
          dragOver ? "upload-zone--dragover" : "",
          isProcessing ? "upload-zone--disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !isProcessing && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isProcessing) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={!isProcessing ? handleDrop : undefined}
        role="button"
        tabIndex={isProcessing ? -1 : 0}
        aria-label="Upload PDF"
        onKeyDown={(e) =>
          e.key === "Enter" && !isProcessing && inputRef.current?.click()
        }
      >
        <svg className="upload-zone__icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 17.5A4.5 4.5 0 016 9a6 6 0 1111.4 2.6A3.5 3.5 0 1119.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="upload-zone__label">
          Drag and drop a PDF, or{" "}
          <span style={{ color: "var(--color-accent)", fontWeight: 500 }}>
            browse
          </span>
        </span>
        <span className="upload-zone__helper">PDF files only · Max 20 MB</span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleInputChange}
          tabIndex={-1}
        />
      </div>

      {file && (
        <div className="file-preview">
          <svg className="file-preview__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="file-preview__name">{file.name}</span>
          <span className="file-preview__size">{formatBytes(file.size)}</span>
          <button
            className="file-preview__remove"
            onClick={handleRemoveFile}
            disabled={isProcessing}
            aria-label="Remove file"
          >
            ✕
          </button>
        </div>
      )}

      {feedback && (
        <div className="upload-feedback">
          <Alert
            variant={feedback.variant}
            message={feedback.message}
            onDismiss={onDismissFeedback}
          />
        </div>
      )}

      <div className="upload-actions">
        <button
          className="btn btn--primary"
          onClick={handleSubmit}
          disabled={!file || isProcessing}
        >
          {isProcessing ? (
            <>
              <Spinner />
              Extracting…
            </>
          ) : (
            "Upload & Extract"
          )}
        </button>
      </div>
    </SectionCard>
  );
}
