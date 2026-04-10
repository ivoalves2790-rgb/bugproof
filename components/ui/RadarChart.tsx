"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[]; // 0-100 per axis
  size?: number;
  color?: string;
  className?: string;
}

export function RadarChart({
  labels,
  values,
  size = 300,
  color = "#00ff41",
  className,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const levels = 4;
  const angleSlice = (Math.PI * 2) / labels.length;

  const getPoint = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  });

  // Grid circles
  const gridCircles = Array.from({ length: levels }, (_, i) => {
    const r = (radius / levels) * (i + 1);
    const points = labels
      .map((_, j) => getPoint(angleSlice * j, r))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
    return points;
  });

  // Axis lines
  const axisLines = labels.map((_, i) => {
    const end = getPoint(angleSlice * i, radius);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  // Data polygon
  const dataPoints = values
    .map((v, i) => {
      const r = (v / 100) * radius;
      return getPoint(angleSlice * i, r);
    })
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  // Label positions
  const labelPositions = labels.map((label, i) => {
    const p = getPoint(angleSlice * i, radius + 20);
    return { label, x: p.x, y: p.y };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      width={size}
      height={size}
    >
      {/* Grid */}
      {gridCircles.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#2a2a2a"
          strokeWidth="1"
        />
      ))}

      {/* Data area */}
      <motion.polygon
        points={dataPoints}
        fill={`${color}15`}
        stroke={color}
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Data points */}
      {values.map((v, i) => {
        const r = (v / 100) * radius;
        const p = getPoint(angleSlice * i, r);
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        );
      })}

      {/* Labels */}
      {labelPositions.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
}
