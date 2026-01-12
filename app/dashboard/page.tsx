"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Dumbbell, Apple, Zap, Flame, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { UserProfile } from "@/lib/types"

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [weekProgress, setWeekProgress] = useState<any>(null)
  const [weightTrendData, setWeightTrendData] = useState<any[]>([])
  const [adherenceData, setAdherenceData] = useState<any[]>([])
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userRes = await fetch("/api/user")
        if (userRes.ok) {
          const userData = await userRes.json()
          setUserProfile(userData)
        }

        // Fetch daily habits for weight trend and adherence
        const habitsRes = await fetch("/api/daily-habits")
        if (habitsRes.ok) {
          const habitsData = await habitsRes.json()

          if (habitsData && habitsData.length > 0) {
            const last7Days = habitsData.slice(0, 7).reverse()
            
            // Calculate weight trend from actual data
            const weights = last7Days
              .filter((d: any) => d.body_weight_kg)
              .map((d: any) => ({
                date: new Date(d.log_date).toLocaleDateString('en-US', { weekday: 'short' }),
                weight: parseFloat(d.body_weight_kg)
              }))
            setWeightTrendData(weights.length > 0 ? weights : [])

            // Calculate adherence score
            const adherence = last7Days.map((d: any) => {
              let score = 0
              if (d.protein_done) score += 25
              if (d.water_done) score += 25
              if (d.steps_done) score += 25
              if (d.cardio_done) score += 25
              return {
                day: new Date(d.log_date).toLocaleDateString('en-US', { weekday: 'short' }),
                score
              }
            })
            setAdherenceData(adherence)

            const avgProtein = Math.round(
              last7Days.reduce((sum: number, d: any) => sum + (d.protein_done ? 140 : 0), 0) / 7,
            )
            const avgWater = (last7Days.reduce((sum: number, d: any) => sum + (d.water_done ? 3 : 0), 0) / 7).toFixed(1)
            const avgSleep = (last7Days.reduce((sum: number, d: any) => sum + (d.sleep_hours || 0), 0) / 7).toFixed(1)
            
            // Calculate streaks
            let workoutStreak = 0
            let dietStreak = 0
            for (const day of habitsData) {
              if (day.cardio_done) workoutStreak++
              else break
            }
            for (const day of habitsData) {
              if (day.protein_done && day.water_done) dietStreak++
              else break
            }

            setWeekProgress({
              workoutStreak,
              dietStreak,
              weekCompletionRate: Math.round(adherence.reduce((sum: any, d: any) => sum + d.score, 0) / adherence.length),
              proteinAverage: avgProtein,
              waterAverage: avgWater,
              stepsAverage: last7Days.filter((d: any) => d.steps_done).length,
              sleepAverage: avgSleep,
            })
          } else {
            // Set default values if no data
            setWeekProgress({
              workoutStreak: 0,
              dietStreak: 0,
              weekCompletionRate: 0,
              proteinAverage: 0,
              waterAverage: "0.0",
              stepsAverage: 0,
              sleepAverage: "0.0",
            })
          }
        }

        // Get today's workout from seed data
        const today = new Date().getDay()
        const HARDCODED_WORKOUTS = (await import('@/lib/seed-workouts')).HARDCODED_WORKOUTS
        setTodayWorkout(HARDCODED_WORKOUTS[today])

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array - only run once on mount

  if (loading || !userProfile || !weekProgress) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back, {userProfile.name}!</h1>
        <p className="text-muted-foreground text-lg">Week 2 of 12 | Goal: {userProfile.goal}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Workout Streak</p>
              <p className="text-2xl font-bold text-primary">{weekProgress.workoutStreak} days</p>
            </div>
            <Dumbbell className="text-primary" size={32} />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Diet Streak</p>
              <p className="text-2xl font-bold text-accent">{weekProgress.dietStreak} days</p>
            </div>
            <Apple className="text-accent" size={32} />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">This Week</p>
              <p className="text-2xl font-bold text-secondary">{weekProgress.weekCompletionRate}%</p>
            </div>
            <TrendingUp className="text-secondary" size={32} />
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Weight Trend</p>
              <p className="text-2xl font-bold text-primary">+0.5 kg</p>
            </div>
            <Zap className="text-primary" size={32} />
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target size={24} className="text-primary" />
          Today's Plan
        </h2>
        {todayWorkout ? (
          <div className="space-y-3">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{todayWorkout.dayName} - {todayWorkout.workoutType}</p>
                <Badge>{todayWorkout.workoutType.includes('Upper') ? 'Upper Body' : todayWorkout.workoutType.includes('Lower') ? 'Lower Body' : todayWorkout.workoutType.includes('Push') ? 'Push' : todayWorkout.workoutType.includes('Pull') ? 'Pull' : todayWorkout.workoutType}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                {todayWorkout.exercises.slice(0, 6).map((ex: any, idx: number) => (
                  <div key={idx}>• {ex.name} {ex.setsTarget}×{ex.repsTarget}</div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/workouts">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Log Workout</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No workout scheduled for today</p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weightTrendData.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-bold mb-4">Weight Trend (Last {weightTrendData.length} days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c4043" />
                <XAxis dataKey="date" stroke="#9aa0a6" />
                <YAxis stroke="#9aa0a6" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2d2e31", border: "1px solid #3c4043" }}
                  labelStyle={{ color: "#f1f3f4" }}
                />
                <Line type="monotone" dataKey="weight" stroke="rgb(66 103 210)" dot={{ fill: "rgb(66 103 210)" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {adherenceData.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-bold mb-4">Weekly Adherence</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c4043" />
                <XAxis dataKey="day" stroke="#9aa0a6" />
                <YAxis stroke="#9aa0a6" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2d2e31", border: "1px solid #3c4043" }}
                  labelStyle={{ color: "#f1f3f4" }}
                />
                <Bar dataKey="score" fill="rgb(227 116 0)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold mb-4">Protein (Daily Average)</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{weekProgress.proteinAverage}g</p>
              <p className="text-sm text-muted-foreground">of {userProfile.proteinTarget}g target</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold mb-4">Water (Daily Average)</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary">{weekProgress.waterAverage}L</p>
              <p className="text-sm text-muted-foreground">of {userProfile.waterTargetLiters}L target</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold mb-4">Sleep (Daily Average)</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">{weekProgress.sleepAverage}h</p>
              <p className="text-sm text-muted-foreground">of {userProfile.sleepTargetHours}h target</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card/50 border-accent/30">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Flame size={20} className="text-accent" />
          Daily Targets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Protein</p>
            <p className="text-lg font-bold text-primary">{userProfile.protein_target}g+</p>
          </div>
          <div>
            <p className="text-muted-foreground">Water</p>
            <p className="text-lg font-bold text-secondary">2.5-4L</p>
          </div>
          <div>
            <p className="text-muted-foreground">Steps</p>
            <p className="text-lg font-bold text-accent">6k-10k</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sleep</p>
            <p className="text-lg font-bold text-primary">{userProfile.sleep_target_hours}+ hrs</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
