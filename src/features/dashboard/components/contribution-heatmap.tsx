type Day = { date: string; count: number };

interface ContributionHeatmapProps {
  days: Day[];
}

const CELL = 11;
const GAP = 3;
const LABEL_HEIGHT = 14;

function intensityClass(count: number): string {
  if (count === 0) return "fill-muted";
  if (count <= 1) return "fill-primary/25";
  if (count <= 3) return "fill-primary/50";
  if (count <= 6) return "fill-primary/75";
  return "fill-primary";
}

function buildWeeks(days: Day[]): (Day | null)[][] {
  if (days.length === 0) return [];
  const leadingEmpty = new Date(days[0].date).getDay();
  const padded: (Day | null)[] = [...Array(leadingEmpty).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function monthLabels(weeks: (Day | null)[][]) {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week.find((d): d is Day => d !== null);
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({
        weekIndex: wi,
        label: new Date(firstDay.date).toLocaleDateString(undefined, { month: "short" }),
      });
      lastMonth = month;
    }
  });
  return labels;
}

export function ContributionHeatmap({ days }: ContributionHeatmapProps) {
  const weeks = buildWeeks(days);
  const labels = monthLabels(weeks);
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP) + LABEL_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height: 104 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {labels.map(({ weekIndex, label }) => (
        <text
          key={weekIndex}
          x={weekIndex * (CELL + GAP)}
          y={10}
          className="fill-muted-foreground"
          style={{ fontSize: 9 }}
        >
          {label}
        </text>
      ))}
      {weeks.map((week, wi) =>
        week.map((day, di) => {
          if (!day) return null;
          const date = new Date(day.date);
          const tooltip = `${date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${day.count} ${day.count === 1 ? "activity" : "activities"}`;

          return (
            <rect
              key={`${wi}-${di}`}
              x={wi * (CELL + GAP)}
              y={di * (CELL + GAP) + LABEL_HEIGHT}
              width={CELL}
              height={CELL}
              rx={2}
              className={intensityClass(day.count)}
            >
              <title>{tooltip}</title>
            </rect>
          );
        })
      )}
    </svg>
  );
}