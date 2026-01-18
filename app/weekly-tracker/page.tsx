"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useRef } from "react"

export default function WeeklyTrackerPage() {
  const printRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const weekRange = `${monday.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })} to ${sunday.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Weekly Tracker</h1>
          <p className="text-muted">Print your training and diet logs for Week 2</p>
        </div>
        <Button
          onClick={handlePrint}
          className="bg-primary text-primary-foreground hover:bg-red-600 flex items-center gap-2"
        >
          <Printer size={20} />
          Print
        </Button>
      </div>

      <div ref={printRef} className="space-y-6 bg-white text-black p-8 print:p-0">
        {/* Training Tracker */}
        <div className="break-before-page">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h2 className="text-2xl font-bold">WEEKLY TRAINING TRACKER</h2>
            <p className="text-sm">Name: ____________ Date: {weekRange}</p>
          </div>

          <div className="mb-4 p-3 bg-gray-100 border border-gray-400 rounded">
            <p className="font-bold">✅ RULES</p>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Add reps or weight weekly</li>
              <li>• Stop sets with 1–2 reps left (good form)</li>
              <li>• Write your top weight + reps</li>
            </ul>
          </div>

          {/* Days */}
          {[
            {
              day: "MONDAY",
              type: "Upper Strength",
              exercises: [
                "Bench Press (5×5)",
                "Pullups/LatPulldown (4×)",
                "Incline DB Press (4×)",
                "Barbell Row (4×)",
                "Cable Fly (3×)",
                "Rope Pushdown (3×)",
              ],
            },
            {
              day: "TUESDAY",
              type: "Lower Strength + Core",
              exercises: [
                "Squat (5×5)",
                "RDL (4×)",
                "Leg Press (3×)",
                "Walking Lunges (2×)",
                "Calf Raises (4×)",
                "Hanging Leg Raise (3×)",
                "Cable Crunch (3×)",
              ],
            },
            {
              day: "WEDNESDAY",
              type: "Rest",
              exercises: ["Walking/Mobility"],
            },
            {
              day: "THURSDAY",
              type: "Push Hypertrophy",
              exercises: [
                "Incline Bench (4×)",
                "Flat DB Press (4×)",
                "Dips (3×)",
                "Lateral Raises (5×)",
                "Rear Delt Fly (3×)",
                "OH Tricep Ext (3×)",
                "Rope Pushdown (2×)",
              ],
            },
            {
              day: "FRIDAY",
              type: "Pull Hypertrophy",
              exercises: [
                "Deadlift (4×4)",
                "Seated Cable Row (4×)",
                "Wide Lat Pulldown (4×)",
                "Face Pulls (3×)",
                "EZ Bar Curl (3×)",
                "Hammer Curl (3×)",
              ],
            },
            {
              day: "SATURDAY",
              type: "Arms + Conditioning",
              exercises: [
                "Close-Grip Bench (4×)",
                "Incline DB Curl (4×)",
                "Cable Pushdown (3×)",
                "Preacher Curl (3×)",
                "Cable Fly (3×)",
                "Lateral Raise (3×)",
              ],
            },
            {
              day: "SUNDAY",
              type: "Full Rest",
              exercises: ["Recovery"],
            },
          ].map((dayPlan, idx) => (
            <div key={idx} className="mb-4">
              <div className="bg-gray-800 text-white p-2 font-bold">
                {dayPlan.day} — {dayPlan.type}
              </div>
              <table className="w-full text-xs border border-gray-400 mb-2">
                <tbody>
                  {dayPlan.exercises.map((ex, exIdx) => (
                    <tr key={exIdx} className="border-b border-gray-400">
                      <td className="p-1 border-r border-gray-400 w-1/3">{ex}</td>
                      <td className="p-1">Set1 ____ Set2 ____ Set3 ____ Set4 ____ Set5 ____</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs">Notes: _________________________________________________________________</div>
            </div>
          ))}

          <div className="mt-6 p-4 border border-gray-400">
            <p className="font-bold mb-2">WEEK SUMMARY</p>
            <div className="text-xs space-y-1">
              <p>✅ Best workout day: ______________________</p>
              <p>✅ Strength improved in: ____________________</p>
              <p>⚠️ Weak points: _____________________________</p>
              <p>Next week goal: ______________________________</p>
            </div>
          </div>
        </div>

        {/* Diet Tracker - Page 2 */}
        <div className="break-before-page">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h2 className="text-2xl font-bold">WEEKLY BODY + DIET TRACKER</h2>
            <p className="text-sm">Date: {weekRange}</p>
          </div>

          <div className="mb-4 p-2 bg-gray-100 border border-gray-400 text-xs">
            <p className="font-bold">✅ DAILY TARGETS</p>
            <p>Protein: 140g+ | Water: 2.5–4L | Steps: 6k–10k | Sleep: 7.5+ hrs</p>
          </div>

          <table className="w-full text-xs border border-gray-400 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-1">DAY</th>
                <th className="border p-1">BW (kg)</th>
                <th className="border p-1">PRO✓</th>
                <th className="border p-1">H₂O✓</th>
                <th className="border p-1">STEPS✓</th>
                <th className="border p-1">CARDIO✓</th>
                <th className="border p-1">SLEEP (h)</th>
                <th className="border p-1">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <tr key={day} className="border">
                  <td className="border p-1 font-bold">{day}</td>
                  <td className="border p-1">____</td>
                  <td className="border p-1 text-center">☐</td>
                  <td className="border p-1 text-center">☐</td>
                  <td className="border p-1 text-center">☐</td>
                  <td className="border p-1 text-center">☐</td>
                  <td className="border p-1">____</td>
                  <td className="border p-1">_____</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-4">
            <p className="font-bold mb-2 text-sm">✅ FOOD QUALITY CHECK</p>
            {[
              "Eggs / Chicken daily?",
              "Fruits (1–2/day)?",
              "Vegetables daily?",
              "Soft drinks avoided?",
              "Junk controlled?",
            ].map((item, idx) => (
              <div key={idx} className="text-xs mb-1 flex items-center gap-2">
                <span className="font-semibold w-1/2">{item}</span>
                <div className="flex gap-1">
                  {["M", "T", "W", "Th", "F", "S", "Su"].map((d) => (
                    <span key={d} className="border border-gray-400 w-5 h-5 flex items-center justify-center">
                      ☐
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border border-gray-400">
            <p className="font-bold text-sm mb-2">✅ WEEKLY CHECK-IN</p>
            <div className="text-xs space-y-1">
              <p>Average weight this week: _________ kg</p>
              <p>Look in mirror: Leaner / Same / More fat</p>
              <p>Strength: Improved / Same / Drop</p>
              <p className="mt-2 font-semibold">Notes to improve next week:</p>
              <div className="border border-gray-400 h-12 mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
