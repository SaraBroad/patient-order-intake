import type { ReactNode } from "react";

interface SectionCardProps {
  number: number | string;
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  number,
  title,
  badge,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={["section-card", className].filter(Boolean).join(" ")}>
      <div className="section-header">
        <span className="section-number" aria-hidden="true">{number}</span>
        <h2 className="section-title">{title}</h2>
        {badge && badge}
      </div>
      {children}
    </section>
  );
}
