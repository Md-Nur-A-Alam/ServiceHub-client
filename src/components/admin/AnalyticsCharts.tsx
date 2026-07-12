"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

interface DailyBooking {
  date: string;
  bookings: number;
}

interface CategoryBreakdown {
  category: string;
  count: number;
}

interface AnalyticsChartsProps {
  bookingsPerDay: DailyBooking[];
  categoryBreakdown: CategoryBreakdown[];
}

// Chart Colors: primary, secondary, tertiary, and muted tints
const COLORS = [
  "var(--color-primary, #6200EE)",
  "var(--color-secondary, #03DAC6)",
  "var(--color-tertiary, #018786)",
  "var(--color-outline, #B0BEC5)",
  "var(--color-outline-variant, #CFD8DC)",
];

const FALLBACK_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#6b7280", // Gray
  "#9ca3af", // Muted Gray
];

export function AnalyticsCharts({ bookingsPerDay, categoryBreakdown }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Bookings / Day Line Chart */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4 min-w-0">
        <div>
          <h3 className="font-bold text-on-surface text-base font-display">Bookings over Last 30 Days</h3>
          <p className="text-xs text-on-surface/50">Daily volume trend</p>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(str) => {
                  const parts = str.split("-");
                  return `${parts[1]}/${parts[2]}`;
                }}
                stroke="currentColor"
                className="text-on-surface/40 text-[10px]"
              />
              <YAxis stroke="currentColor" className="text-on-surface/40 text-[10px]" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-outline-variant, #ccc)",
                  borderRadius: "12px",
                  color: "var(--color-on-surface, #000)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="var(--color-primary, #6366f1)"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4 min-w-0">
        <div>
          <h3 className="font-bold text-on-surface text-base font-display">Category Breakdown</h3>
          <p className="text-xs text-on-surface/50">Booking share by service sector</p>
        </div>
        <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-4">
          {categoryBreakdown.length === 0 ? (
            <span className="text-xs text-on-surface/40">No data available</span>
          ) : (
            <>
              <div className="w-full sm:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="category"
                    >
                      {categoryBreakdown.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface, #fff)",
                        borderColor: "var(--color-outline-variant, #ccc)",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend details */}
              <div className="w-full sm:w-1/2 flex flex-col gap-2">
                {categoryBreakdown.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: FALLBACK_COLORS[index % FALLBACK_COLORS.length] }}
                      />
                      <span className="capitalize text-on-surface/80">{item.category}</span>
                    </div>
                    <span className="font-bold text-on-surface">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AnalyticsCharts;
