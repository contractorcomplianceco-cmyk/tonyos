import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

export type RadarPoint = { label: string; score: number; level?: string };

export function IntelRadar({ data }: { data: RadarPoint[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="hsl(var(--card-border))" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name="Health"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={1.5}
            isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: "12px",
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--card-border))",
              borderRadius: "4px",
              color: "hsl(var(--card-foreground))",
            }}
            itemStyle={{ color: "hsl(var(--card-foreground))" }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(val: number) => [`${val}/100`, "Health"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
