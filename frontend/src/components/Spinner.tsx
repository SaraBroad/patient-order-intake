interface SpinnerProps {
  muted?: boolean;
}

export default function Spinner({ muted = false }: SpinnerProps) {
  return (
    <span
      className={["spinner", muted ? "spinner--muted" : ""].join(" ").trim()}
      role="status"
      aria-label="Loading"
    />
  );
}
