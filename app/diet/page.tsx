"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Target, AlertCircle } from "lucide-react"

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const FOOD_ITEMS = [
  { id: "eggs_chicken", label: "Eggs / Chicken daily" },
  { id: "fruits", label: "Fruits (1-2/day)" },
  { id: "veggies", label: "Vegetables (daily)" },
  { id: "soft_drink_avoided", label: "Soft drinks avoided (max 1/week)" },
  { id: "junk_controlled", label: "Junk controlled (max 1 meal/week)" },
]

export default function DietPage() {
  const [dailyLogs, setDailyLogs] = useState<any>({})
  const [foodChecklist, setFoodChecklist] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const handleDailyLogChange = (date: string, field: string, value: any) => {
    setDailyLogs((prev: any) => ({
      ...prev,
      [date]: { ...prev[date], [field]: value },
    }))
  }

  const handleFoodChecklistChange = (date: string, item: string, value: boolean) => {
    setFoodChecklist((prev: any) => ({
      ...prev,
      [date]: { ...prev[date], [item]: value },
    }))
  }

  const handleSaveWeek = async () => {
    try {
      setLoading(true)

      // Save daily habit logs
      for (const day of DAYS_SHORT) {
        const dayLog = dailyLogs[day]
        if (dayLog) {
          const today = new Date()
          const logDate = new Date(today.getTime() - DAYS_SHORT.indexOf(day) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]

          await fetch("/api/daily-habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              log_date: logDate,
              body_weight_kg: dayLog.weight ? Number.parseFloat(dayLog.weight) : null,
              protein_done: dayLog.protein || false,
              water_done: dayLog.water || false,
              steps_done: dayLog.steps || false,
              cardio_done: dayLog.cardio || false,
              sleep_hours: dayLog.sleep ? Number.parseFloat(dayLog.sleep) : null,
              notes: dayLog.notes || null,
            }),
          })
        }
      }

      // Save food quality logs
      for (const day of DAYS_SHORT) {
        const dayFood = foodChecklist[day]
        if (dayFood) {
          const today = new Date()
          const logDate = new Date(today.getTime() - DAYS_SHORT.indexOf(day) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]

          await fetch("/api/food-quality", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              log_date: logDate,
              eggs_chicken_done: dayFood.eggs_chicken || false,
              fruits_done: dayFood.fruits || false,
              veggies_done: dayFood.veggies || false,
              soft_drink_avoided: dayFood.soft_drink_avoided || false,
              junk_controlled: dayFood.junk_controlled || false,
            }),
          })
        }
      }

      alert("Weekly diet log saved successfully!")
      setDailyLogs({})
      setFoodChecklist({})
    } catch (error) {
      console.error("Error saving diet log:", error)
      alert("Failed to save diet log")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Diet Tracker</h1>
        <p className="text-muted-foreground">Track daily nutrition and food quality</p>
      </div>

      <Card className="p-6 bg-card/50 border-accent/30">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Daily Targets
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-2xl font-bold text-accent">140g+</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Water</p>
            <p className="text-2xl font-bold text-cyan-400">3-4L</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Steps</p>
            <p className="text-2xl font-bold text-green-400">8k-10k</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sleep</p>
            <p className="text-2xl font-bold text-purple-400">7.5+h</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border overflow-x-auto">
        <h2 className="font-bold mb-4">Weekly Daily Log</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-transparent">
              <TableHead className="text-foreground font-bold">Day</TableHead>
              <TableHead className="text-foreground font-bold">Weight (kg)</TableHead>
              <TableHead className="text-foreground font-bold">Protein ✓</TableHead>
              <TableHead className="text-foreground font-bold">Water ✓</TableHead>
              <TableHead className="text-foreground font-bold">Steps ✓</TableHead>
              <TableHead className="text-foreground font-bold">Cardio ✓</TableHead>
              <TableHead className="text-foreground font-bold">Sleep (h)</TableHead>
              <TableHead className="text-foreground font-bold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DAYS_SHORT.map((day) => (
              <TableRow key={day} className="border-slate-700 hover:bg-slate-800">
                <TableCell className="font-semibold">{day}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="75.5"
                    step="0.1"
                    value={dailyLogs[day]?.weight || ""}
                    onChange={(e) => handleDailyLogChange(day, "weight", e.target.value)}
                    className="w-20 bg-slate-700 border-slate-600 text-foreground"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={dailyLogs[day]?.protein || false}
                    onCheckedChange={(e) => handleDailyLogChange(day, "protein", e)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={dailyLogs[day]?.water || false}
                    onCheckedChange={(e) => handleDailyLogChange(day, "water", e)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={dailyLogs[day]?.steps || false}
                    onCheckedChange={(e) => handleDailyLogChange(day, "steps", e)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={dailyLogs[day]?.cardio || false}
                    onCheckedChange={(e) => handleDailyLogChange(day, "cardio", e)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="7.5"
                    step="0.5"
                    value={dailyLogs[day]?.sleep || ""}
                    onChange={(e) => handleDailyLogChange(day, "sleep", e.target.value)}
                    className="w-16 bg-slate-700 border-slate-600 text-foreground"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Notes..."
                    value={dailyLogs[day]?.notes || ""}
                    onChange={(e) => handleDailyLogChange(day, "notes", e.target.value)}
                    className="w-24 bg-slate-700 border-slate-600 text-foreground text-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4">Food Quality Checklist (Weekly)</h2>
        <div className="space-y-4">
          {FOOD_ITEMS.map((item) => (
            <div key={item.id} className="p-4 bg-slate-800 rounded-lg">
              <p className="font-semibold mb-3">{item.label}</p>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {DAYS_SHORT.map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={foodChecklist[day]?.[item.id] || false}
                      onCheckedChange={(e) => handleFoodChecklistChange(day, item.id, e as boolean)}
                    />
                    <span className="text-xs">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card/50 border-secondary/30">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={20} className="text-cyan-400" />
          Auto Adjustment Rules
        </h2>
        <div className="space-y-2 text-sm">
          <p>✓ Weight ↑ too fast (+0.7kg/week)? → Reduce 1 carb portion at dinner</p>
          <p>✓ Weight not ↑? → Add 1 carb portion daily (extra rice/roti)</p>
          <p>✓ Belly fat ↑? → Add 10 min cardio x2/week</p>
          <p>✓ Strength stops? → Add 1 rest day + increase sleep</p>
        </div>
      </Card>

      <Button
        onClick={handleSaveWeek}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-red-600 py-3 font-bold"
      >
        {loading ? "Saving..." : "Save Weekly Diet Log"}
      </Button>
    </div>
  )
}
