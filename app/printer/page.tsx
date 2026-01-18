"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useEffect, useState } from "react"

type User = {
  id: number
  name: string
  age?: number
  height_cm?: number
  weight_kg?: number
  goal?: string
  protein_target: number
  water_target_liters: number
  steps_target: number
  sleep_target_hours: number
}

type Exercise = {
  name: string
  sets_target: number
  reps_target: string
  notes?: string
}

type WorkoutPlan = {
  id: number
  day_of_week: number
  day_name: string
  workout_type: string
  exercises: Exercise[]
}

type DailyHabit = {
  log_date: string
  body_weight_kg?: number
  protein_done: boolean
  water_done: boolean
  steps_done: boolean
  sleep_hours?: number
}

type FoodQuality = {
  log_date: string
  eggs_chicken_done: boolean
  fruits_done: boolean
  veggies_done: boolean
  soft_drink_avoided: boolean
  junk_controlled: boolean
}

export default function PrinterPage() {
  const [user, setUser] = useState<User | null>(null)
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>([])
  const [foodQuality, setFoodQuality] = useState<FoodQuality[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState({ weekNum: 1, startDate: "", endDate: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current week's Monday and Sunday
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        const startDate = monday.toISOString().split("T")[0]
        const endDate = sunday.toISOString().split("T")[0]

        // Calculate week number (simplified)
        const weekNum = Math.ceil((today.getDate() + 6) / 7)

        setCurrentWeek({
          weekNum,
          startDate: monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          endDate: sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })

        // Fetch user data
        const userRes = await fetch("/api/user")
        const userData = await userRes.json()
        setUser(userData)

        // Fetch workout plans with exercises
        const plansRes = await fetch("/api/workout-plans")
        const plansData = await plansRes.json()
        setWorkoutPlans(plansData)

        // Fetch daily habits for the week
        const habitsRes = await fetch(`/api/daily-habits?startDate=${startDate}&endDate=${endDate}`)
        const habitsData = await habitsRes.json()
        setDailyHabits(habitsData)

        // Fetch food quality for the week
        const foodRes = await fetch(`/api/food-quality?startDate=${startDate}&endDate=${endDate}`)
        const foodData = await foodRes.json()
        setFoodQuality(foodData)
      } catch (error) {
        console.error("Error fetching printer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const getDayHabits = (dayName: string) => {
    const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(dayName)
    return dailyHabits.find((h) => new Date(h.log_date).getDay() === (dayIndex + 1) % 7)
  }

  const getDayFoodQuality = (dayName: string) => {
    const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(dayName)
    return foodQuality.find((f) => new Date(f.log_date).getDay() === (dayIndex + 1) % 7)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading tracker data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 print:p-4">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold mb-2">Weekly Tracker Print View</h1>
        <p className="text-muted-foreground mb-4">Print or save as PDF for offline tracking</p>
        <Button onClick={handlePrint} className="bg-primary text-primary-foreground flex items-center gap-2">
          <Printer size={20} />
          Print / Save as PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div className="print:block space-y-6">
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-4xl font-bold mb-1">GymLine Weekly Tracker</h1>
          <p className="text-lg text-muted-foreground">Week {currentWeek.weekNum} of 12 - Transformation Log</p>
          <p className="text-sm text-muted-foreground mt-2">
            Date Range: {currentWeek.startDate} to {currentWeek.endDate}
          </p>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">NAME</p>
            <p className="text-lg font-bold">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">WEIGHT (kg)</p>
            <p className="text-lg font-bold">{user?.weight_kg || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">GOAL</p>
            <p className="text-lg font-bold">{user?.goal || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">STATUS</p>
            <p className="text-lg font-bold text-primary">On Track</p>
          </div>
        </div>

        {/* Weekly Workouts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Weekly Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {workoutPlans.length === 0 ? (
              <p className="text-muted-foreground">No workout plans found. Please set up your workout plan first.</p>
            ) : (
              workoutPlans.map((workout) => (
                <div key={workout.id} className="border border-slate-700 rounded p-4 print:break-inside-avoid">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">{workout.day_name}</h3>
                    <div className="text-xs bg-slate-700 px-2 py-1 rounded text-foreground font-semibold">
                      {workout.workout_type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {workout.exercises && workout.exercises.length > 0 ? (
                      workout.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="text-sm border-t border-slate-800 pt-2">
                          <p className="font-semibold">{ex.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ex.sets_target} × {ex.reps_target}
                          </p>

                          {/* Logging Lines */}
                          <div className="mt-1 space-y-1">
                            {Array.from({ length: Math.min(ex.sets_target, 3) }).map((_, setIdx) => (
                              <div key={setIdx} className="text-xs border-b border-dotted border-slate-800 py-1">
                                Set {setIdx + 1}: _____ kg × _____ reps (RIR: ___)
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No exercises defined</p>
                    )}
                  </div>

                  <div className="mt-3 p-2 bg-slate-800 rounded text-xs">
                    <p className="font-semibold mb-1">Notes:</p>
                    <div className="border-b border-dotted border-slate-700 h-6" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Habits Tracker */}
        <div className="mt-8 print:page-break-before">
          <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Daily Habits Tracker</h2>

          <table className="w-full border-collapse border border-slate-700 text-xs">
            <thead>
              <tr className="bg-slate-800">
                <th className="border border-slate-700 p-2 text-left">Day</th>
                <th className="border border-slate-700 p-2 text-center">Weight</th>
                <th className="border border-slate-700 p-2 text-center">Protein</th>
                <th className="border border-slate-700 p-2 text-center">Water</th>
                <th className="border border-slate-700 p-2 text-center">Steps</th>
                <th className="border border-slate-700 p-2 text-center">Sleep</th>
              </tr>
            </thead>
            <tbody>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                const habits = getDayHabits(day)
                return (
                  <tr key={day}>
                    <td className="border border-slate-700 p-2 font-semibold">{day}</td>
                    <td className="border border-slate-700 p-2 text-center">
                      {habits?.body_weight_kg ? `${habits.body_weight_kg} kg` : "_____ kg"}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {habits?.protein_done ? "☑" : "☐"}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {habits?.water_done ? "☑" : "☐"}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {habits?.steps_done ? "☑" : "☐"}
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      {habits?.sleep_hours ? `${habits.sleep_hours} h` : "_____ h"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Food Quality Checklist */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Food Quality Checklist</h2>

          <table className="w-full border-collapse border border-slate-700 text-xs">
            <thead>
              <tr className="bg-slate-800">
                <th className="border border-slate-700 p-2 text-left">Item</th>
                <th className="border border-slate-700 p-2 text-center">M</th>
                <th className="border border-slate-700 p-2 text-center">T</th>
                <th className="border border-slate-700 p-2 text-center">W</th>
                <th className="border border-slate-700 p-2 text-center">Th</th>
                <th className="border border-slate-700 p-2 text-center">F</th>
                <th className="border border-slate-700 p-2 text-center">S</th>
                <th className="border border-slate-700 p-2 text-center">Su</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Eggs / Chicken daily", key: "eggs_chicken_done" },
                { name: "Fruits (1-2/day)", key: "fruits_done" },
                { name: "Vegetables (daily)", key: "veggies_done" },
                { name: "Soft drinks avoided", key: "soft_drink_avoided" },
                { name: "Junk controlled", key: "junk_controlled" },
              ].map((item) => (
                <tr key={item.key}>
                  <td className="border border-slate-700 p-2 text-left font-semibold">{item.name}</td>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                    const food = getDayFoodQuality(day)
                    const checked = food?.[item.key as keyof FoodQuality]
                    return (
                      <td key={day} className="border border-slate-700 p-2 text-center">
                        {checked ? "☑" : "☐"}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-700 text-xs text-muted-foreground text-center print:text-sm">
          <p>GymLine v1.0 - Your 12-Week Fitness Transformation Companion</p>
          <p>Generated: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        </div>
      </div>
    </div>
  )
}
