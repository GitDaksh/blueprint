interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function BarChart({ data, height = 160 }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      {data.map((d, i) => {
        const barHeight = (d.value / max) * (height - 24);
        const x = i * barWidth + barWidth * 0.25;
        const width = barWidth * 0.5;
        const y = height - 24 - barHeight;

        return (
          <g key={d.label}>
            <rect x={x} y={y} width={width} height={barHeight} rx={1} className="fill-primary" />
            <text
              x={x + width / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 6 }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}