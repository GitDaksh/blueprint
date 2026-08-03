export function DotGridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklch, var(--foreground) 15%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}