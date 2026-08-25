import type { Order } from "../types";
import SectionCard from "./SectionCard";

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
}

export default function ExtractedInfoSection({ data }: ExtractedInfoSectionProps) {
  if (!data) return null;

  return (
    <SectionCard
      number="2"
      title="Extracted Information"
      badge={<AiBadge />}
      className="extracted-card"
    >
      <div className="field-grid">
        <FieldItem label="First Name" value={data.patient_first_name} />
        <FieldItem label="Last Name" value={data.patient_last_name} />
        <FieldItem label="Date of Birth" value={data.patient_date_of_birth} />
      </div>
    </SectionCard>
  );
}
