"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { HARDCODED_WORKOUTS } from "@/lib/seed-workouts"

export default function PrinterPage() {
  const handlePrint = () => {
    window.print()
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
          <h1 className="text-4xl font-bold mb-1">LeanForge Weekly Tracker</h1>
          <p className="text-lg text-muted-foreground">Week 2 of 12 - Transformation Log</p>
          <p className="text-sm text-muted-foreground mt-2">Date Range: Monday to Sunday</p>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">NAME</p>
            <p className="text-lg font-bold">Alex</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">WEIGHT (kg)</p>
            <p className="text-lg font-bold">75.5</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">GOAL</p>
            <p className="text-lg font-bold">Lean Strength</p>
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
            {HARDCODED_WORKOUTS.map((workout, idx) => (
              <div key={idx} className="border border-slate-700 rounded p-4 print:break-inside-avoid">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">{workout.dayName}</h3>
                  <div className="text-xs bg-slate-700 px-2 py-1 rounded text-foreground font-semibold">
                    {workout.workoutType}
                  </div>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="text-sm border-t border-slate-800 pt-2">
                      <p className="font-semibold">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ex.setsTarget} × {ex.repsTarget}
                      </p>

                      {/* Logging Lines */}
                      <div className="mt-1 space-y-1">
                        {Array.from({ length: Math.min(ex.setsTarget, 3) }).map((_, setIdx) => (
                          <div key={setIdx} className="text-xs border-b border-dotted border-slate-800 py-1">
                            Set {setIdx + 1}: _____ kg × _____ reps (RIR: ___)
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-2 bg-slate-800 rounded text-xs">
                  <p className="font-semibold mb-1">Notes:</p>
                  <div className="border-b border-dotted border-slate-700 h-6" />
                </div>
              </div>
            ))}
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
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <tr key={day}>
                  <td className="border border-slate-700 p-2 font-semibold">{day}</td>
                  <td className="border border-slate-700 p-2 text-center">_____ kg</td>
                  <td className="border border-slate-700 p-2 text-center">☐</td>
                  <td className="border border-slate-700 p-2 text-center">☐</td>
                  <td className="border border-slate-700 p-2 text-center">☐</td>
                  <td className="border border-slate-700 p-2 text-center">_____ h</td>
                </tr>
              ))}
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
                "Eggs / Chicken daily",
                "Fruits (1-2/day)",
                "Vegetables (daily)",
                "Soft drinks avoided",
                "Junk controlled",
              ].map((item) => (
                <tr key={item}>
                  <td className="border border-slate-700 p-2 text-left font-semibold">{item}</td>
                  {Array(7)
                    .fill(0)
                    .map((_, idx) => (
                      <td key={idx} className="border border-slate-700 p-2 text-center">
                        ☐
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-700 text-xs text-muted-foreground text-center print:text-sm">
          <p>LeanForge v1.0 - Your 12-Week Fitness Transformation Companion</p>
          <p>Printed: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
