"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Unit } from "@/lib/data/types";

interface MedalBarChartProps {
  units: Unit[];
}

export function MedalBarChart({ units }: MedalBarChartProps) {
  const chartData = units.map((u) => ({
    name: u.code,
    fullName: u.name,
    Gold: u.gold,
    Silver: u.silver,
    Bronze: u.bronze,
    Points: u.totalPoints,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "#E2E8F0" }}
          />
          <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: "#E2E8F0" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-card p-2.5 shadow-lg text-xs">
                    <p className="font-bold text-hp-ink dark:text-white">
                      {data.fullName} ({label})
                    </p>
                    <div className="mt-1.5 space-y-1">
                      <p className="text-amber-600 font-semibold flex justify-between gap-4">
                        <span>🥇 Gold:</span> <span>{data.Gold}</span>
                      </p>
                      <p className="text-slate-500 font-semibold flex justify-between gap-4">
                        <span>🥈 Silver:</span> <span>{data.Silver}</span>
                      </p>
                      <p className="text-amber-800 font-semibold flex justify-between gap-4">
                        <span>🥉 Bronze:</span> <span>{data.Bronze}</span>
                      </p>
                      <p className="border-t border-border pt-1 font-bold text-hp-navy dark:text-primary flex justify-between gap-4">
                        <span>Total Points:</span> <span>{data.Points}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          <Bar dataKey="Gold" stackId="medals" fill="#D4AF37" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Silver" stackId="medals" fill="#94A3B8" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Bronze" stackId="medals" fill="#CD7F32" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MedalBarChart;

