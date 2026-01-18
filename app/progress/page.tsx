"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { TrendingUp, Zap, Target } from "lucide-react"

export default function ProgressPage() {
  const [weightData, setWeightData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adherenceHeatmap, setAdherenceHeatmap] = useState<number[][]>([])

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/daily-habits")
        if (res.ok) {
          const data = await res.json()
          
          // Group by week and calculate averages
          const weeks: any = {}
          data.forEach((log: any) => {
            if (log.body_weight_kg) {
              const date = new Date(log.log_date)
              const weekNum = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
              if (!weeks[weekNum]) weeks[weekNum] = []
              weeks[weekNum].push(parseFloat(log.body_weight_kg))
            }
          })

          const chartData = Object.keys(weeks).map(week => ({
            week: `Week ${week}`,
            weight: parseFloat((weeks[week].reduce((a: number, b: number) => a + b, 0) / weeks[week].length).toFixed(1)),
            avg: parseFloat((weeks[week].reduce((a: number, b: number) => a + b, 0) / weeks[week].length).toFixed(1))
          })).reverse().slice(0, 4)

          setWeightData(chartData)
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  // No hardcoded data - all from database

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading progress...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your 12-week transformation</p>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Weight Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[74, 77]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
              labelStyle={{ color: "#f8fafc" }}
            />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="rgb(34 197 94)" name="Daily Weight" dot={{ fill: "rgb(34 197 94)" }} />
            <Line type="monotone" dataKey="avg" stroke="rgb(249 115 22)" name="Weekly Average" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Strength and volume tracking coming soon - log workouts to see data */}

      {adherenceHeatmap.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="font-bold mb-4">Adherence Heatmap (Last 3 weeks)</h2>
          <div className="space-y-2">
            {adherenceHeatmap.map((weekData, weekIdx) => (
              <div key={weekIdx} className="flex items-center gap-4">
                <span className="text-sm font-semibold w-16">Week {3 - weekIdx}</span>
                <div className="flex gap-1">
                  {weekData.map((value, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${value})`,
                        border: "1px solid rgba(148, 163, 184, 0.3)",
                      }}
                      title={`Day ${dayIdx + 1}: ${Math.round(value * 100)}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Week summary - track your workouts and habits to see insights here */}
    </div>
  )
}
