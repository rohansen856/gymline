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

  const strengthData = [
    { lift: "Bench Press", estimated1rm: 0, progress: "Track in workouts" },
    { lift: "Squat", estimated1rm: 0, progress: "Track in workouts" },
    { lift: "Deadlift", estimated1rm: 0, progress: "Track in workouts" },
  ]

  const volumeData = [
    { muscle: "Chest", sets: 0, fill: "rgb(66 103 210)" },
    { muscle: "Back", sets: 0, fill: "rgb(52 168 83)" },
    { muscle: "Legs", sets: 0, fill: "rgb(251 188 4)" },
    { muscle: "Arms", sets: 0, fill: "rgb(227 116 0)" },
    { muscle: "Shoulders", sets: 0, fill: "rgb(234 67 53)" },
  ]

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

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-accent" />
          Strength Progress (Estimated 1RM)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-2 font-bold text-foreground">Lift</th>
                <th className="text-left py-2 px-2 font-bold text-foreground">Est. 1RM</th>
                <th className="text-left py-2 px-2 font-bold text-foreground">Progress</th>
              </tr>
            </thead>
            <tbody>
              {strengthData.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800">
                  <td className="py-3 px-2">{item.lift}</td>
                  <td className="py-3 px-2 font-bold text-primary">{item.estimated1rm} kg</td>
                  <td className="py-3 px-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">{item.progress}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4">Weekly Volume by Muscle Group</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="muscle" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
              labelStyle={{ color: "#f8fafc" }}
            />
            <Bar dataKey="sets" fill="rgb(249 115 22)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4">Adherence Heatmap (Last 3 weeks)</h2>
        <div className="space-y-2">
          {["Week 1", "Week 2", "Week 3"].map((week, weekIdx) => (
            <div key={week} className="flex items-center gap-4">
              <span className="text-sm font-semibold w-12">{week}</span>
              <div className="flex gap-1">
                {adherenceHeatmap[weekIdx].map((value, dayIdx) => (
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

      <Card className="p-6 bg-card/50 border-border">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Week 2 Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Best Workout Day</p>
            <p className="font-bold text-primary">Friday - Pull Hypertrophy</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Strength Improved In</p>
            <p className="font-bold text-accent">Deadlift, Squat</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Weak Points</p>
            <p className="font-bold text-secondary">Water intake, Cardio frequency</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Next Week Goal</p>
            <p className="font-bold text-accent">+2-3 reps on Bench Press</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
