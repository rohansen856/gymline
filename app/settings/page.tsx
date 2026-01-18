"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Download, Upload, Trash2, Moon, Sun } from "lucide-react"
import { Target } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    age: 25,
    heightCm: 170,
    weightKg: 70,
    goal: "Athletic + Lean Strength",
  })

  const [targets, setTargets] = useState({
    proteinTarget: 140,
    waterTargetLiters: 3,
    stepsTarget: 8000,
    sleepTargetHours: 7.5,
  })

  const [theme, setTheme] = useState("dark")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setProfile({
              name: data.name || "",
              age: data.age || 25,
              heightCm: data.height_cm || 170,
              weightKg: parseFloat(data.weight_kg) || 70,
              goal: data.goal || "Athletic + Lean Strength",
            })
            setTargets({
              proteinTarget: data.protein_target || 140,
              waterTargetLiters: parseFloat(data.water_target_liters) || 3,
              stepsTarget: data.steps_target || 8000,
              sleepTargetHours: parseFloat(data.sleep_target_hours) || 7.5,
            })
            setIsNewUser(false)
          } else {
            setIsNewUser(true)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleProfileChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleTargetChange = (field: string, value: any) => {
    setTargets((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          age: profile.age,
          height_cm: profile.heightCm,
          weight_kg: profile.weightKg,
          goal: profile.goal,
          protein_target: targets.proteinTarget,
          water_target_liters: targets.waterTargetLiters,
          steps_target: targets.stepsTarget,
          sleep_target_hours: targets.sleepTargetHours,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")
      const updatedData = await res.json()
      if (isNewUser) {
        setIsNewUser(false)
      }
      alert("Profile saved successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    const data = { profile, targets }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "gymline-backup.json"
    a.click()
    alert("Data exported successfully!")
  }

  const handleClearData = () => {
    if (confirm("Are you sure? This will clear all your data.")) {
      alert("Data cleared!")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          {isNewUser ? "Create your profile to get started" : "Manage your profile and preferences"}
        </p>
      </div>

      {isNewUser && (
        <Card className="p-6 bg-primary/10 border-primary">
          <p className="text-sm">
            👋 Welcome! Please fill in your details below to create your profile.
          </p>
        </Card>
      )}

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Settings size={20} className="text-primary" />
          User Profile
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Age</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => handleProfileChange("age", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Height (cm)</label>
              <Input
                type="number"
                value={profile.heightCm}
                onChange={(e) => handleProfileChange("heightCm", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={profile.weightKg}
                onChange={(e) => handleProfileChange("weightKg", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Goal</label>
              <Input
                value={profile.goal}
                onChange={(e) => handleProfileChange("goal", e.target.value)}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-red-600"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Daily Targets
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Protein Target (g)</label>
              <Input
                type="number"
                value={targets.proteinTarget}
                onChange={(e) => handleTargetChange("proteinTarget", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Water Target (L)</label>
              <Input
                type="number"
                step="0.5"
                value={targets.waterTargetLiters}
                onChange={(e) => handleTargetChange("waterTargetLiters", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Steps Target</label>
              <Input
                type="number"
                value={targets.stepsTarget}
                onChange={(e) => handleTargetChange("stepsTarget", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Sleep Target (h)</label>
              <Input
                type="number"
                step="0.5"
                value={targets.sleepTargetHours}
                onChange={(e) => handleTargetChange("sleepTargetHours", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-foreground"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-red-600"
          >
            {loading ? "Updating..." : "Update Targets"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4">Data Management</h2>
        <div className="space-y-3">
          <Button
            onClick={handleExportData}
            className="w-full bg-green-700 text-white hover:bg-green-800 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Export Data (JSON)
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent">
            <Upload size={20} />
            Import Data
          </Button>
          <Button
            onClick={handleClearData}
            variant="outline"
            className="w-full text-red-500 hover:bg-red-900 flex items-center justify-center gap-2 bg-transparent"
          >
            <Trash2 size={20} />
            Clear All Data
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-bold mb-4">Appearance</h2>
        <div className="flex items-center gap-4">
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setTheme("dark")}
          >
            <Moon size={20} />
            Dark Mode
          </Button>
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setTheme("light")}
          >
            <Sun size={20} />
            Light Mode
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
        <h2 className="font-bold mb-2">About GymLine</h2>
        <p className="text-sm text-muted-foreground">
          GymLine v1.0 - Your personal 12-week fitness transformation companion. Built with Next.js + TypeScript +
          Tailwind CSS + PostgreSQL.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Production Ready</Badge>
          <Badge className="bg-green-900 text-green-200 border-green-700">PostgreSQL Backed</Badge>
        </div>
      </Card>
    </div>
  )
}
