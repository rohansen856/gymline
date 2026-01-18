"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, TrendingDown, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BodyMeasurement = {
  id: number
  user_id: number
  measurement_date: string
  weight_kg?: number
  chest_cm?: number
  waist_cm?: number
  hips_cm?: number
  bicep_left_cm?: number
  bicep_right_cm?: number
  forearm_left_cm?: number
  forearm_right_cm?: number
  thigh_left_cm?: number
  thigh_right_cm?: number
  calf_left_cm?: number
  calf_right_cm?: number
  neck_cm?: number
  shoulders_cm?: number
  body_fat_percentage?: number
  notes?: string
  created_at: string
  updated_at: string
}

export default function BodyMeasurementsPage() {
  const { toast } = useToast()
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const [formData, setFormData] = useState({
    measurement_date: today,
    weight_kg: "",
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    bicep_left_cm: "",
    bicep_right_cm: "",
    forearm_left_cm: "",
    forearm_right_cm: "",
    thigh_left_cm: "",
    thigh_right_cm: "",
    calf_left_cm: "",
    calf_right_cm: "",
    neck_cm: "",
    shoulders_cm: "",
    body_fat_percentage: "",
    notes: "",
  })

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    try {
      const response = await fetch("/api/body-measurements?limit=10")
      const data = await response.json()
      // Ensure data is always an array
      setMeasurements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching measurements:", error)
      setMeasurements([]) // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to load body measurements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Convert empty strings to null for numeric fields
      const payload = {
        measurement_date: formData.measurement_date,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        chest_cm: formData.chest_cm ? parseFloat(formData.chest_cm) : null,
        waist_cm: formData.waist_cm ? parseFloat(formData.waist_cm) : null,
        hips_cm: formData.hips_cm ? parseFloat(formData.hips_cm) : null,
        bicep_left_cm: formData.bicep_left_cm ? parseFloat(formData.bicep_left_cm) : null,
        bicep_right_cm: formData.bicep_right_cm ? parseFloat(formData.bicep_right_cm) : null,
        forearm_left_cm: formData.forearm_left_cm ? parseFloat(formData.forearm_left_cm) : null,
        forearm_right_cm: formData.forearm_right_cm ? parseFloat(formData.forearm_right_cm) : null,
        thigh_left_cm: formData.thigh_left_cm ? parseFloat(formData.thigh_left_cm) : null,
        thigh_right_cm: formData.thigh_right_cm ? parseFloat(formData.thigh_right_cm) : null,
        calf_left_cm: formData.calf_left_cm ? parseFloat(formData.calf_left_cm) : null,
        calf_right_cm: formData.calf_right_cm ? parseFloat(formData.calf_right_cm) : null,
        neck_cm: formData.neck_cm ? parseFloat(formData.neck_cm) : null,
        shoulders_cm: formData.shoulders_cm ? parseFloat(formData.shoulders_cm) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        notes: formData.notes || null,
      }

      const response = await fetch("/api/body-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle validation errors
        if (data.field) {
          toast({
            title: "Validation Error",
            description: data.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to save measurement",
            variant: "destructive",
          })
        }
        setSaving(false)
        return
      }

      toast({
        title: "Success",
        description: "Body measurement saved successfully",
      })

      // Refresh measurements list
      await fetchMeasurements()

      // Reset form
      setFormData({
        measurement_date: today,
        weight_kg: "",
        chest_cm: "",
        waist_cm: "",
        hips_cm: "",
        bicep_left_cm: "",
        bicep_right_cm: "",
        forearm_left_cm: "",
        forearm_right_cm: "",
        thigh_left_cm: "",
        thigh_right_cm: "",
        calf_left_cm: "",
        calf_right_cm: "",
        neck_cm: "",
        shoulders_cm: "",
        body_fat_percentage: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error saving measurement:", error)
      toast({
        title: "Error",
        description: "Failed to save body measurement",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getChange = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous) return null
    const change = current - previous
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNegative: change < 0,
    }
  }

  const latestMeasurement = measurements[0]
  const previousMeasurement = measurements[1]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Body Measurements</h1>
        <p className="text-muted-foreground">Track your body composition and progress over time</p>
      </div>

      {/* Add New Measurement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Record New Measurement
          </CardTitle>
          <CardDescription>Enter your body measurements for today or select a different date</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="measurement_date">Measurement Date</Label>
                <Input
                  id="measurement_date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.measurement_date}
                  onChange={(e) => handleChange("measurement_date", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Primary Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Primary Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="65.5"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange("weight_kg", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="body_fat_percentage">Body Fat %</Label>
                  <Input
                    id="body_fat_percentage"
                    type="number"
                    step="0.1"
                    min="1"
                    max="60"
                    placeholder="18.5"
                    value={formData.body_fat_percentage}
                    onChange={(e) => handleChange("body_fat_percentage", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Upper Body */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Upper Body</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="chest_cm">Chest (cm)</Label>
                  <Input
                    id="chest_cm"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder="95.0"
                    value={formData.chest_cm}
                    onChange={(e) => handleChange("chest_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="shoulders_cm">Shoulders (cm)</Label>
                  <Input
                    id="shoulders_cm"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder="110.0"
                    value={formData.shoulders_cm}
                    onChange={(e) => handleChange("shoulders_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="neck_cm">Neck (cm)</Label>
                  <Input
                    id="neck_cm"
                    type="number"
                    step="0.1"
                    min="20"
                    max="80"
                    placeholder="38.0"
                    value={formData.neck_cm}
                    onChange={(e) => handleChange("neck_cm", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Arms */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Arms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bicep_left_cm">Bicep Left (cm)</Label>
                  <Input
                    id="bicep_left_cm"
                    type="number"
                    step="0.1"
                    min="10"
                    max="80"
                    placeholder="34.0"
                    value={formData.bicep_left_cm}
                    onChange={(e) => handleChange("bicep_left_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bicep_right_cm">Bicep Right (cm)</Label>
                  <Input
                    id="bicep_right_cm"
                    type="number"
                    step="0.1"
                    min="10"
                    max="80"
                    placeholder="34.5"
                    value={formData.bicep_right_cm}
                    onChange={(e) => handleChange("bicep_right_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="forearm_left_cm">Forearm Left (cm)</Label>
                  <Input
                    id="forearm_left_cm"
                    type="number"
                    step="0.1"
                    min="10"
                    max="60"
                    placeholder="28.0"
                    value={formData.forearm_left_cm}
                    onChange={(e) => handleChange("forearm_left_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="forearm_right_cm">Forearm Right (cm)</Label>
                  <Input
                    id="forearm_right_cm"
                    type="number"
                    step="0.1"
                    min="10"
                    max="60"
                    placeholder="28.5"
                    value={formData.forearm_right_cm}
                    onChange={(e) => handleChange("forearm_right_cm", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Core & Hips */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Core & Hips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="waist_cm">Waist (cm)</Label>
                  <Input
                    id="waist_cm"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder="80.0"
                    value={formData.waist_cm}
                    onChange={(e) => handleChange("waist_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hips_cm">Hips (cm)</Label>
                  <Input
                    id="hips_cm"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder="92.0"
                    value={formData.hips_cm}
                    onChange={(e) => handleChange("hips_cm", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Legs */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Legs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="thigh_left_cm">Thigh Left (cm)</Label>
                  <Input
                    id="thigh_left_cm"
                    type="number"
                    step="0.1"
                    min="20"
                    max="100"
                    placeholder="52.0"
                    value={formData.thigh_left_cm}
                    onChange={(e) => handleChange("thigh_left_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="thigh_right_cm">Thigh Right (cm)</Label>
                  <Input
                    id="thigh_right_cm"
                    type="number"
                    step="0.1"
                    min="20"
                    max="100"
                    placeholder="52.5"
                    value={formData.thigh_right_cm}
                    onChange={(e) => handleChange("thigh_right_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="calf_left_cm">Calf Left (cm)</Label>
                  <Input
                    id="calf_left_cm"
                    type="number"
                    step="0.1"
                    min="15"
                    max="80"
                    placeholder="36.0"
                    value={formData.calf_left_cm}
                    onChange={(e) => handleChange("calf_left_cm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="calf_right_cm">Calf Right (cm)</Label>
                  <Input
                    id="calf_right_cm"
                    type="number"
                    step="0.1"
                    min="15"
                    max="80"
                    placeholder="36.5"
                    value={formData.calf_right_cm}
                    onChange={(e) => handleChange("calf_right_cm", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any observations, conditions, or context for this measurement..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.notes.length}/500 characters
              </p>
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Measurement"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Last Measurement Details */}
      <Card>
        <CardHeader>
          <CardTitle>Last Recorded Measurement</CardTitle>
          <CardDescription>
            {latestMeasurement 
              ? `Recorded on ${new Date(latestMeasurement.measurement_date).toLocaleDateString("en-IN", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              : "No previous measurements found"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!latestMeasurement ? (
            <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed">
              <p className="text-lg font-medium text-muted-foreground mb-2">⚠️ No Prior Data</p>
              <p className="text-sm text-muted-foreground">
                You haven't recorded any measurements yet. Fill out the form above to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Metrics */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">PRIMARY METRICS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {latestMeasurement.weight_kg && (
                    <div className="p-3 border rounded-lg bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Weight</p>
                      <p className="text-xl font-bold">{latestMeasurement.weight_kg} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                    </div>
                  )}
                  {latestMeasurement.body_fat_percentage && (
                    <div className="p-3 border rounded-lg bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Body Fat</p>
                      <p className="text-xl font-bold">{latestMeasurement.body_fat_percentage} <span className="text-sm font-normal text-muted-foreground">%</span></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upper Body */}
              {(latestMeasurement.chest_cm || latestMeasurement.shoulders_cm || latestMeasurement.neck_cm) && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">UPPER BODY</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {latestMeasurement.chest_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Chest</p>
                        <p className="text-xl font-bold">{latestMeasurement.chest_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.shoulders_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Shoulders</p>
                        <p className="text-xl font-bold">{latestMeasurement.shoulders_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.neck_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Neck</p>
                        <p className="text-xl font-bold">{latestMeasurement.neck_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Arms */}
              {(latestMeasurement.bicep_left_cm || latestMeasurement.bicep_right_cm || latestMeasurement.forearm_left_cm || latestMeasurement.forearm_right_cm) && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">ARMS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {latestMeasurement.bicep_left_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Bicep Left</p>
                        <p className="text-xl font-bold">{latestMeasurement.bicep_left_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.bicep_right_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Bicep Right</p>
                        <p className="text-xl font-bold">{latestMeasurement.bicep_right_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.forearm_left_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Forearm Left</p>
                        <p className="text-xl font-bold">{latestMeasurement.forearm_left_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.forearm_right_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Forearm Right</p>
                        <p className="text-xl font-bold">{latestMeasurement.forearm_right_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Core & Hips */}
              {(latestMeasurement.waist_cm || latestMeasurement.hips_cm) && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">CORE & HIPS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {latestMeasurement.waist_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Waist</p>
                        <p className="text-xl font-bold">{latestMeasurement.waist_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.hips_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Hips</p>
                        <p className="text-xl font-bold">{latestMeasurement.hips_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Legs */}
              {(latestMeasurement.thigh_left_cm || latestMeasurement.thigh_right_cm || latestMeasurement.calf_left_cm || latestMeasurement.calf_right_cm) && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">LEGS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {latestMeasurement.thigh_left_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Thigh Left</p>
                        <p className="text-xl font-bold">{latestMeasurement.thigh_left_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.thigh_right_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Thigh Right</p>
                        <p className="text-xl font-bold">{latestMeasurement.thigh_right_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.calf_left_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Calf Left</p>
                        <p className="text-xl font-bold">{latestMeasurement.calf_left_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                    {latestMeasurement.calf_right_cm && (
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">Calf Right</p>
                        <p className="text-xl font-bold">{latestMeasurement.calf_right_cm} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {latestMeasurement.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">NOTES</h3>
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-sm italic">{latestMeasurement.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Measurement Comparison */}
      {latestMeasurement && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Measurements</CardTitle>
            <CardDescription>
              Recorded on {new Date(latestMeasurement.measurement_date).toLocaleDateString("en-IN")}
              {previousMeasurement &&
                ` • Compared to ${new Date(previousMeasurement.measurement_date).toLocaleDateString("en-IN")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { label: "Weight", value: latestMeasurement.weight_kg, prev: previousMeasurement?.weight_kg, unit: "kg" },
                {
                  label: "Body Fat",
                  value: latestMeasurement.body_fat_percentage,
                  prev: previousMeasurement?.body_fat_percentage,
                  unit: "%",
                },
                { label: "Chest", value: latestMeasurement.chest_cm, prev: previousMeasurement?.chest_cm, unit: "cm" },
                { label: "Waist", value: latestMeasurement.waist_cm, prev: previousMeasurement?.waist_cm, unit: "cm" },
                { label: "Hips", value: latestMeasurement.hips_cm, prev: previousMeasurement?.hips_cm, unit: "cm" },
                {
                  label: "Bicep (L)",
                  value: latestMeasurement.bicep_left_cm,
                  prev: previousMeasurement?.bicep_left_cm,
                  unit: "cm",
                },
                {
                  label: "Bicep (R)",
                  value: latestMeasurement.bicep_right_cm,
                  prev: previousMeasurement?.bicep_right_cm,
                  unit: "cm",
                },
                {
                  label: "Thigh (L)",
                  value: latestMeasurement.thigh_left_cm,
                  prev: previousMeasurement?.thigh_left_cm,
                  unit: "cm",
                },
                {
                  label: "Thigh (R)",
                  value: latestMeasurement.thigh_right_cm,
                  prev: previousMeasurement?.thigh_right_cm,
                  unit: "cm",
                },
                {
                  label: "Calf (L)",
                  value: latestMeasurement.calf_left_cm,
                  prev: previousMeasurement?.calf_left_cm,
                  unit: "cm",
                },
              ]
                .filter((item) => item.value !== null && item.value !== undefined)
                .map((item) => {
                  const change = getChange(item.value, item.prev)
                  return (
                    <div key={item.label} className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-2xl font-bold">
                        {item.value} <span className="text-sm text-muted-foreground">{item.unit}</span>
                      </p>
                      {change && (
                        <div
                          className={`flex items-center gap-1 text-xs mt-1 ${
                            change.isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {change.isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {change.value} {item.unit}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurement History */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
          <CardDescription>Your last 10 measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : measurements.length === 0 ? (
            <p className="text-muted-foreground">No measurements recorded yet. Add your first measurement above!</p>
          ) : (
            <div className="space-y-4">
              {measurements.map((m) => (
                <div key={m.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">
                        {new Date(m.measurement_date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recorded: {new Date(m.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-sm">
                    {m.weight_kg && (
                      <div>
                        <span className="text-muted-foreground">Weight:</span> {m.weight_kg} kg
                      </div>
                    )}
                    {m.body_fat_percentage && (
                      <div>
                        <span className="text-muted-foreground">BF%:</span> {m.body_fat_percentage}%
                      </div>
                    )}
                    {m.chest_cm && (
                      <div>
                        <span className="text-muted-foreground">Chest:</span> {m.chest_cm} cm
                      </div>
                    )}
                    {m.waist_cm && (
                      <div>
                        <span className="text-muted-foreground">Waist:</span> {m.waist_cm} cm
                      </div>
                    )}
                    {m.bicep_left_cm && (
                      <div>
                        <span className="text-muted-foreground">Bicep (L):</span> {m.bicep_left_cm} cm
                      </div>
                    )}
                    {m.bicep_right_cm && (
                      <div>
                        <span className="text-muted-foreground">Bicep (R):</span> {m.bicep_right_cm} cm
                      </div>
                    )}
                  </div>
                  {m.notes && <p className="text-sm text-muted-foreground mt-2 italic">{m.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
