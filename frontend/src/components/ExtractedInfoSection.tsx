import { useEffect, useMemo, useState } from "react";
import type { Order, OrderUpdatePayload } from "../types";
import Alert from "./Alert";
import SectionCard from "./SectionCard";
import Spinner from "./Spinner";

function AiBadge() {
  return (
    <span className="badge badge--ai" aria-label="AI extracted">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1l1.8 4H14l-3.5 2.7 1.3 4.3L8 9.5l-3.8 2.5 1.3-4.3L2 5h4.2L8 1z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      AI Extracted
    </span>
  );
}

interface FieldItemProps {
  label: string;
  value: string | null | undefined;
}

function FieldItem({ label, value }: FieldItemProps) {
  return (
    <div className="field-item">
      <div className="field-item__label">{label}</div>
      <div className="field-item__value">{value ?? "—"}</div>
    </div>
  );
}

interface ExtractedInfoSectionProps {
  data: Order | null;
  onSave: (payload: OrderUpdatePayload) => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
  onDismissSaveError: () => void;
}

export default function ExtractedInfoSection({
  data,
  onSave,
  isSaving,
  saveError,
  onDismissSaveError,
}: ExtractedInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (!data) return;
    setIsEditing(false);
    setFirstName(data.patient_first_name);
    setLastName(data.patient_last_name);
    setDateOfBirth(data.patient_date_of_birth);
  }, [
    data?.id,
    data?.patient_first_name,
    data?.patient_last_name,
    data?.patient_date_of_birth,
  ]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    return (
      firstName.trim() !== data.patient_first_name ||
      lastName.trim() !== data.patient_last_name ||
      dateOfBirth !== data.patient_date_of_birth
    );
  }, [data, firstName, lastName, dateOfBirth]);

  const canSave =
    isDirty &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    dateOfBirth.length > 0 &&
    !isSaving;

  if (!data) return null;

  function handleCancel() {
    setFirstName(data.patient_first_name);
    setLastName(data.patient_last_name);
    setDateOfBirth(data.patient_date_of_birth);
    setIsEditing(false);
    onDismissSaveError();
  }

  async function handleSave() {
    if (!canSave) return;

    const payload: OrderUpdatePayload = {};
    if (firstName.trim() !== data.patient_first_name) {
      payload.patient_first_name = firstName.trim();
    }
    if (lastName.trim() !== data.patient_last_name) {
      payload.patient_last_name = lastName.trim();
    }
    if (dateOfBirth !== data.patient_date_of_birth) {
      payload.patient_date_of_birth = dateOfBirth;
    }

    await onSave(payload);
  }

  return (
    <SectionCard
      number="2"
      title="Extracted Information"
      badge={<AiBadge />}
      className="extracted-card"
    >
      {isEditing ? (
        <div className="order-form">
          <div className="form-group">
            <label className="form-label" htmlFor="extracted-first-name">
              First Name
            </label>
            <input
              id="extracted-first-name"
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSaving}
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="extracted-last-name">
              Last Name
            </label>
            <input
              id="extracted-last-name"
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSaving}
              autoComplete="family-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="extracted-dob">
              Date of Birth
            </label>
            <input
              id="extracted-dob"
              className="form-input"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>
      ) : (
        <div className="field-grid">
          <FieldItem label="First Name" value={data.patient_first_name} />
          <FieldItem label="Last Name" value={data.patient_last_name} />
          <FieldItem label="Date of Birth" value={data.patient_date_of_birth} />
        </div>
      )}

      {saveError && (
        <div className="upload-feedback">
          <Alert variant="error" message={saveError} onDismiss={onDismissSaveError} />
        </div>
      )}

      <div className="order-form-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => void handleSave()}
              disabled={!canSave}
            >
              {isSaving ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              onDismissSaveError();
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        )}
      </div>
    </SectionCard>
  );
}
