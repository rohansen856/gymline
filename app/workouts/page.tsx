"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Get local day index (0 = Monday, 6 = Sunday)
function getLocalDayIndex() {
  const now = new Date()
  const localDay = now.getDay()
  return localDay === 0 ? 6 : localDay - 1
}

export default function WorkoutsPage() {
  const [selectedDay, setSelectedDay] = useState(getLocalDayIndex())
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([])
  const [workoutLog, setWorkoutLog] = useState<any>({})
  const [cardio, setCardio] = useState<any>({})
  const [cardioDuration, setCardioDuration] = useState<any>({})
  const [notes, setNotes] = useState<any>({})
  const [restDayData, setRestDayData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    setSelectedDay(getLocalDayIndex())
    fetchWorkoutPlans()
  }, [])

  const fetchWorkoutPlans = async () => {
    try {
      const res = await fetch("/api/workout-plans")
      if (res.ok) {
        const data = await res.json()
        setWorkoutPlans(data)
      }
    } catch (error) {
      console.error("Error fetching workout plans:", error)
    } finally {
      setLoadingPlans(false)
    }
  }

  const currentWorkout = workoutPlans.find(p => p.day_of_week === selectedDay + 1)

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

      const workoutRes = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_date: today,
          day_type: currentWorkout.workoutType,
          cardio_done: cardio[selectedDay] || false,
          cardio_duration_min: cardio[selectedDay] ? Number.parseInt(cardioDuration[selectedDay] || "0") : null,
          notes: notes[selectedDay] || null,
        }),
      })

      if (!workoutRes.ok) throw new Error("Failed to save workout")
      const savedLog = await workoutRes.json()

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
      setCardioDuration({})
      setNotes({})
      setRestDayData({})
    } catch (error) {
      console.error("Error saving workout:", error)
      alert("Failed to save workout")
    } finally {
      setLoading(false)
    }
  }

  const getDayColor = (type: string) => {
    if (type.includes("Rest")) return "bg-slate-800"
    if (type.includes("Upper")) return "bg-red-900/40"
    if (type.includes("Lower")) return "bg-blue-900/40"
    if (type.includes("Push")) return "bg-orange-900/40"
    if (type.includes("Pull")) return "bg-purple-900/40"
    return "bg-green-900/40"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weekly Training Tracker</h1>
        <p className="text-muted-foreground">Track your workouts and progress</p>
      </div>

      {loadingPlans ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading workout plans...</p>
          </div>
        </div>
      ) : workoutPlans.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Workout Plans Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't set up your workout plans yet. Run the database seeder to create default workout plans.
          </p>
        </Card>
      ) : (
        <>

      <Card className="p-4 bg-yellow-950/20 border-yellow-700/30">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-200 mb-2">✅ RULES</h3>
            <ul className="text-sm text-yellow-100 space-y-1">
              <li>• Add reps or weight weekly</li>
              <li>• Stop sets with 1–2 reps left (good form)</li>
              <li>• Write your top weight + reps</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <Tabs value={selectedDay.toString()} onValueChange={(val) => setSelectedDay(Number.parseInt(val))}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-1 bg-muted/30 p-1 h-auto">
            {DAYS.map((day, idx) => {
              const isToday = idx === getLocalDayIndex()
              return (
                <TabsTrigger
                  key={idx}
                  value={idx.toString()}
                  className={`text-xs py-2 relative ${
                    selectedDay === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {day.slice(0, 3)}
                  {isToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {workoutPlans.map((workout) => (
            <TabsContent key={workout.id} value={(workout.day_of_week - 1).toString()} className="space-y-4 mt-4">
              <div className={`p-4 rounded-lg ${getDayColor(workout.workout_type)}`}>
                <h2 className="text-2xl font-bold mb-1">{workout.day_name.toUpperCase()} — {workout.workout_type}</h2>
                <p className="text-xs text-muted-foreground">
                  {(workout.day_of_week - 1) === getLocalDayIndex() && <span className="text-green-400 font-semibold">● Today</span>}
                </p>
              </div>

              {(workout.workout_type === "Rest" || workout.workout_type === "Full Rest") && (
                <div className="space-y-4">
                  <Card className="p-4 bg-card border-border">
                    <h3 className="font-bold mb-3">Recovery Activities</h3>
                    
                    {workout.day_name === "Wednesday" && (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm font-medium sm:w-32">Steps / Walk:</label>
                          <Input
                            type="text"
                            placeholder="e.g., 30 min walk"
                            value={restDayData[`${workout.id}_steps`] || ""}
                            onChange={(e) => setRestDayData((prev: any) => ({ ...prev, [`${workout.id}_steps`]: e.target.value }))}
                            className="flex-1 bg-input border-border"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm font-medium sm:w-32">Mobility:</label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`mobility-${workout.id}`}
                              checked={restDayData[`${workout.id}_mobility`] || false}
                              onCheckedChange={(e) => setRestDayData((prev: any) => ({ ...prev, [`${workout.id}_mobility`]: e }))}
                            />
                            <label htmlFor={`mobility-${workout.id}`} className="text-sm cursor-pointer">
                              Completed (shoulder, hip, hamstring stretches)
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {workout.day_name === "Sunday" && (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm font-medium sm:w-32">Recovery:</label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`recovery-${workout.id}`}
                              checked={restDayData[`${workout.id}_recovery`] || false}
                              onCheckedChange={(e) => setRestDayData((prev: any) => ({ ...prev, [`${workout.id}_recovery`]: e }))}
                            />
                            <label htmlFor={`recovery-${workout.id}`} className="text-sm cursor-pointer">
                              Full rest taken
                            </label>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm font-medium sm:w-32">Stretching:</label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`stretching-${workout.id}`}
                              checked={restDayData[`${workout.id}_stretching`] || false}
                              onCheckedChange={(e) => setRestDayData((prev: any) => ({ ...prev, [`${workout.id}_stretching`]: e }))}
                            />
                            <label htmlFor={`stretching-${workout.id}`} className="text-sm cursor-pointer">
                              Light stretching completed
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-4 bg-card border-border">
                    <label className="block font-semibold mb-2">Notes</label>
                    <Textarea
                      placeholder="How did you feel? Recovery status?"
                      value={notes[workout.id] || ""}
                      onChange={(e) => setNotes((prev: any) => ({ ...prev, [workout.id]: e.target.value }))}
                      className="w-full bg-input border-border text-foreground min-h-[80px]"
                    />
                  </Card>
                </div>
              )}

              {workout.workout_type !== "Rest" && workout.workout_type !== "Full Rest" && (
                <div className="space-y-4">
                  {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((exercise: any, exIdx: number) => (
                      <Card key={exIdx} className="p-4 bg-card border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{exercise.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Target: {exercise.sets_target} sets × {exercise.reps_target} reps
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {Array.from({ length: exercise.sets_target }).map((_, setNum) => {
                            const logKey = `${exercise.name}-${setNum + 1}`
                            const logData = workoutLog[logKey] || {}

                            return (
                              <div key={setNum} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-primary">Set {setNum + 1}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Weight (kg)</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={logData.weight || ""}
                                      onChange={(e) => handleSetChange(exercise.name, setNum + 1, "weight", e.target.value)}
                                      className="w-full bg-input border-border text-foreground"
                                      step="0.5"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Reps</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={logData.reps || ""}
                                      onChange={(e) => handleSetChange(exercise.name, setNum + 1, "reps", e.target.value)}
                                      className="w-full bg-input border-border text-foreground"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">RIR</label>
                                    <Input
                                      type="number"
                                      placeholder="0-3"
                                      value={logData.rir || ""}
                                    onChange={(e) => handleSetChange(exercise.name, setNum + 1, "rir", e.target.value)}
                                    className="w-full bg-input border-border text-foreground"
                                    min="0"
                                    max="3"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {exercise.sets_target >= 3 && (
                        <div className="mt-3 p-2 bg-blue-950/30 border border-blue-700/30 rounded text-xs text-blue-200">
                          💡 Tip: Aim for 1-2 reps in reserve (RIR). If you complete all target reps with RIR 0, increase weight next time.
                        </div>
                      )}
                    </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No exercises defined for this day. Set up your workout plan in Settings.</p>
                  )}

                  {(workout.day_name === "Tuesday" || workout.day_name === "Thursday") && (
                    <Card className="p-4 bg-amber-950/20 border-amber-700/30">
                      <h3 className="font-bold mb-3 text-amber-200">Cardio (10 min)</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`cardio-${workout.id}`}
                            checked={cardio[workout.id] || false}
                            onCheckedChange={(e) => setCardio((prev: any) => ({ ...prev, [workout.id]: e }))}
                          />
                          <label htmlFor={`cardio-${workout.id}`} className="font-semibold cursor-pointer text-sm">
                            Completed
                          </label>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-sm">Duration:</label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={cardioDuration[workout.id] || ""}
                            onChange={(e) => setCardioDuration((prev: any) => ({ ...prev, [workout.id]: e.target.value }))}
                            className="w-20 bg-input border-border text-foreground"
                            min="0"
                          />
                          <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {workout.day_name === "Saturday" && (
                    <Card className="p-4 bg-amber-950/20 border-amber-700/30">
                      <h3 className="font-bold mb-3 text-amber-200">Conditioning (12 min)</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`conditioning-${workout.id}`}
                            checked={cardio[workout.id] || false}
                            onCheckedChange={(e) => setCardio((prev: any) => ({ ...prev, [workout.id]: e }))}
                          />
                          <label htmlFor={`conditioning-${workout.id}`} className="font-semibold cursor-pointer text-sm">
                            Completed
                          </label>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-sm">Duration:</label>
                          <Input
                            type="number"
                            placeholder="12"
                            value={cardioDuration[workout.id] || ""}
                            onChange={(e) => setCardioDuration((prev: any) => ({ ...prev, [workout.id]: e.target.value }))}
                            className="w-20 bg-input border-border text-foreground"
                            min="0"
                          />
                          <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-4 bg-card border-border">
                    <label className="block font-semibold mb-2">Workout Notes</label>
                    <Textarea
                      placeholder="How did it feel? Energy levels? Any observations or changes for next time?"
                      value={notes[workout.id] || ""}
                      onChange={(e) => setNotes((prev: any) => ({ ...prev, [workout.id]: e.target.value }))}
                      className="w-full bg-input border-border text-foreground min-h-[100px]"
                    />
                  </Card>
                </div>
              )}

              <Button
                onClick={handleSaveWorkout}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4 font-bold text-lg"
              >
                {loading ? "Saving..." : `✅ Save ${workout.dayName} Workout`}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold mb-4">📊 Week Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">✅ Best workout day:</label>
            <Input
              type="text"
              placeholder="e.g., Friday - Pull Day"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">✅ Strength improved in:</label>
            <Input
              type="text"
              placeholder="e.g., Bench Press, Squat"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">⚠️ Weak points / fix next week:</label>
            <Input
              type="text"
              placeholder="e.g., Shoulder mobility, Cardio consistency"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Next week goal (weight/reps):</label>
            <Input
              type="text"
              placeholder="e.g., +2.5kg on Bench, +2 reps on Pullups"
              className="bg-input border-border"
            />
          </div>
        </div>
      </Card>
        </>
      )}
    </div>
  )
}
