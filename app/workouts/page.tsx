"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HARDCODED_WORKOUTS } from "@/lib/seed-workouts"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function WorkoutsPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [workoutLog, setWorkoutLog] = useState<any>({})
  const [cardio, setCardio] = useState<any>({})
  const [notes, setNotes] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const currentWorkout = HARDCODED_WORKOUTS[selectedDay]

  const handleSetChange = (exerciseName: string, setNum: number, field: string, value: any) => {
    const key = `${exerciseName}-${setNum}`
    setWorkoutLog((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const handleSaveWorkout = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]

      // Save workout log
      const workoutRes = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_date: today,
          day_type: currentWorkout.workoutType,
          cardio_done: cardio[selectedDay] || false,
          cardio_duration_min: cardio[selectedDay] ? Number.parseInt(cardio[`${selectedDay}_duration`]) : null,
          notes: notes[selectedDay] || null,
        }),
      })

      if (!workoutRes.ok) throw new Error("Failed to save workout")
      const savedLog = await workoutRes.json()

      // Save exercise set logs
      for (const [key, data] of Object.entries(workoutLog)) {
        if ((data as any).weight || (data as any).reps) {
          await fetch("/api/exercise-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workout_log_id: savedLog.id,
              exercise_name: key.split("-")[0],
              set_number: Number.parseInt(key.split("-")[1]),
              weight: (data as any).weight || null,
              reps: (data as any).reps || null,
              rir: (data as any).rir || null,
            }),
          })
        }
      }

      alert("Workout logged successfully!")
      setWorkoutLog({})
      setCardio({})
      setNotes({})
    } catch (error) {
      console.error("Error saving workout:", error)
      alert("Failed to save workout")
    } finally {
      setLoading(false)
    }
  }

  const getDayColor = (type: string) => {
    if (type.includes("Rest")) return "bg-slate-800"
    if (type.includes("Upper")) return "bg-red-900"
    if (type.includes("Lower")) return "bg-blue-900"
    if (type.includes("Push")) return "bg-orange-900"
    if (type.includes("Pull")) return "bg-purple-900"
    return "bg-green-900"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Workout Tracker</h1>
        <p className="text-muted-foreground">Log your sets, reps, and weights daily</p>
      </div>

      <Card className="p-6 bg-card border-border">
        <Tabs defaultValue="0" onValueChange={(val) => setSelectedDay(Number.parseInt(val))}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-1 bg-muted/30 p-1 h-auto">
            {DAYS.map((day, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className={`text-xs py-2 ${
                  selectedDay === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {HARDCODED_WORKOUTS.map((workout, idx) => (
            <TabsContent key={idx} value={idx.toString()} className="space-y-4">
              <div className={`p-4 rounded-lg ${getDayColor(workout.workoutType)}`}>
                <h2 className="text-2xl font-bold mb-1">{workout.dayName}</h2>
                <p className="text-sm text-muted-foreground">{workout.workoutType}</p>
              </div>

              <div className="space-y-4">
                {workout.exercises.map((exercise, exIdx) => (
                  <Card key={exIdx} className="p-4 bg-card border-border">
                    <h3 className="font-bold mb-3">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Target: {exercise.setsTarget}×{exercise.repsTarget}
                    </p>

                    {Array.from({ length: exercise.setsTarget }).map((_, setNum) => {
                      const logKey = `${exercise.name}-${setNum + 1}`
                      const logData = workoutLog[logKey] || {}

                      return (
                        <div key={setNum} className="flex items-center gap-3 mb-2 p-2 bg-muted/30 rounded">
                          <span className="text-sm font-semibold min-w-8">Set {setNum + 1}:</span>
                          <Input
                            type="number"
                            placeholder="Weight (kg)"
                            value={logData.weight || ""}
                            onChange={(e) => handleSetChange(exercise.name, setNum + 1, "weight", e.target.value)}
                            className="w-24 bg-input border-border text-foreground"
                          />
                          <span className="text-muted-foreground">×</span>
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={logData.reps || ""}
                            onChange={(e) => handleSetChange(exercise.name, setNum + 1, "reps", e.target.value)}
                            className="w-24 bg-input border-border text-foreground"
                          />
                          <span className="text-muted-foreground text-sm">RIR:</span>
                          <Input
                            type="number"
                            placeholder="0-3"
                            value={logData.rir || ""}
                            onChange={(e) => handleSetChange(exercise.name, setNum + 1, "rir", e.target.value)}
                            className="w-16 bg-input border-border text-foreground"
                            min="0"
                            max="3"
                          />
                        </div>
                      )
                    })}

                    {exercise.setsTarget >= 3 && (
                      <div className="mt-3 p-2 bg-primary/10 border border-primary/30 rounded text-sm text-primary">
                        💪 If you hit top reps for all sets last time, increase weight next session
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {workout.workoutType !== "Rest" && (
                <Card className="p-4 bg-card border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`cardio-${idx}`}
                        checked={cardio[idx] || false}
                        onCheckedChange={(e) => setCardio((prev: any) => ({ ...prev, [idx]: e }))}
                      />
                      <label htmlFor={`cardio-${idx}`} className="font-semibold cursor-pointer">
                        Cardio Done
                      </label>
                    </div>
                    <Input
                      type="number"
                      placeholder="Duration (min)"
                      value={cardio[`${idx}_duration`] || ""}
                      onChange={(e) => setCardio((prev: any) => ({ ...prev, [`${idx}_duration`]: e.target.value }))}
                      className="w-32 bg-input border-border text-foreground"
                    />
                  </div>
                </Card>
              )}

              <Card className="p-4 bg-card border-border">
                <label className="block font-semibold mb-2">Notes</label>
                <textarea
                  placeholder="How did it feel? Any observations?"
                  value={notes[idx] || ""}
                  onChange={(e) => setNotes((prev: any) => ({ ...prev, [idx]: e.target.value }))}
                  className="w-full bg-input border border-border rounded p-2 text-foreground placeholder-muted-foreground text-sm"
                  rows={3}
                />
              </Card>

              <Button
                onClick={handleSaveWorkout}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-bold"
              >
                {loading ? "Saving..." : `Save ${workout.dayName} Workout`}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  )
}
