"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Calendar, Users, DollarSign, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { Icon } from '@iconify/react'

interface TripData {
  startLocation: string
  destination: string
  startDate: string
  endDate: string
  themes: string[]
  pace: string
  weather: string
  accommodation: string
  food: string[]
  transport: string
  currency: string
  budget: string
  passengers: string
  preferences: string
}

const travelThemes = [
  { name: "Historical Sites and Landmarks", icon: "mdi:castle" },
  { name: "Adventure", icon: "mdi:hiking" },
  { name: "Shopping & Relaxation", icon: "mdi:shopping" },
  { name: "Local Culture", icon: "mdi:theater" },
  { name: "Beaches", icon: "mdi:beach" },
  { name: "Hills, Nature and Wildlife", icon: "mdi:pine-tree" },
  { name: "Nightlife", icon: "mdi:glass-cocktail" },
  { name: "For the Gram", icon: "mdi:instagram" }
]

const foodPreferences = [
  { name: "Vegetarian", icon: "mdi:leaf" },
  { name: "Vegan", icon: "mdi:sprout" },
  { name: "Gluten Free", icon: "mdi:wheat-off" },
  { name: "Halal", icon: "mdi:food-halal" },
  { name: "Kosher", icon: "mdi:star-david" },
  { name: "Local Cuisine", icon: "mdi:chef-hat" }
]

export default function CreatePlanPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [tripData, setTripData] = useState<TripData>({
    startLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    themes: [],
    pace: "",
    weather: "",
    accommodation: "",
    food: [],
    transport: "",
    currency: "USD",
    budget: "",
    passengers: "1",
    preferences: ""
  })

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Store trip data and navigate to results
      localStorage.setItem('tripData', JSON.stringify(tripData))
      router.push('/create-plan/generating')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleThemeToggle = (theme: string) => {
    setTripData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme) 
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }))
  }

  const handleFoodToggle = (food: string) => {
    setTripData(prev => ({
      ...prev,
      food: prev.food.includes(food) 
        ? prev.food.filter(f => f !== food)
        : [...prev.food, food]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelAI
            </span>
          </Link>
          <div className="text-sm text-gray-600">
            Step {currentStep} of 4
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><Icon icon="mdi:map-marker-radius" className="w-5 h-5" /> Destination & Dates</>}
              {currentStep === 2 && <><Icon icon="mdi:account-heart" className="w-5 h-5" /> Travel Preferences</>}
              {currentStep === 3 && <><Icon icon="mdi:food-fork-drink" className="w-5 h-5" /> Accommodation & Food</>}
              {currentStep === 4 && <><Icon icon="mdi:wallet" className="w-5 h-5" /> Budget & Final Details</>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Set the course, own the journey"}
              {currentStep === 2 && "Craft your comfort zone"}
              {currentStep === 3 && "Choose your style"}
              {currentStep === 4 && "Add the final touches"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Destination & Dates */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Where are you starting your trip from?</Label>
                  <Input
                    id="startLocation"
                    placeholder="Enter your start city here..."
                    value={tripData.startLocation}
                    onChange={(e) => setTripData(prev => ({ ...prev, startLocation: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Search for your destination country/city</Label>
                  <Input
                    id="destination"
                    placeholder="Search for places..."
                    value={tripData.destination}
                    onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Which travel themes best describe your dream getaway? (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelThemes.map((theme) => (
                      <div key={theme.name} className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-gray-50">
                        <Checkbox
                          id={theme.name}
                          checked={tripData.themes.includes(theme.name)}
                          onCheckedChange={() => handleThemeToggle(theme.name)}
                        />
                        <Icon icon={theme.icon} className="w-4 h-4 text-gray-600" />
                        <Label htmlFor={theme.name} className="text-sm cursor-pointer">{theme.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Travel Preferences */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>What pace of travel do you prefer? (Optional)</Label>
                  <Select value={tripData.pace} onValueChange={(value) => setTripData(prev => ({ ...prev, pace: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow and Easy</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>What kind of weather do you prefer? (Optional)</Label>
                  <Select value={tripData.weather} onValueChange={(value) => setTripData(prev => ({ ...prev, weather: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm and Sunny</SelectItem>
                      <SelectItem value="cool">Cool and Breezy</SelectItem>
                      <SelectItem value="cold">Cold and Snowy</SelectItem>
                      <SelectItem value="mild">Mild and Pleasant</SelectItem>
                      <SelectItem value="rainy">Rainy and Cozy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>How would you like to travel? (Optional)</Label>
                  <Select value={tripData.transport} onValueChange={(value) => setTripData(prev => ({ ...prev, transport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flights">Flights</SelectItem>
                      <SelectItem value="trains">Trains</SelectItem>
                      <SelectItem value="buses">Buses</SelectItem>
                      <SelectItem value="road">Road Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Accommodation & Food */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label>What type of accommodation would you prefer? (Optional)</Label>
                  <Select value={tripData.accommodation} onValueChange={(value) => setTripData(prev => ({ ...prev, accommodation: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3star">3 Star Hotel</SelectItem>
                      <SelectItem value="4star">4 Star Hotel</SelectItem>
                      <SelectItem value="5star">5 Star Hotel</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>What type of food would you like to enjoy? (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {foodPreferences.map((food) => (
                      <div key={food.name} className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-gray-50">
                        <Checkbox
                          id={food.name}
                          checked={tripData.food.includes(food.name)}
                          onCheckedChange={() => handleFoodToggle(food.name)}
                        />
                        <Icon icon={food.icon} className="w-4 h-4 text-gray-600" />
                        <Label htmlFor={food.name} className="text-sm cursor-pointer">{food.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Budget & Final Details */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Which currency would you like to use? (Optional)</Label>
                  <Select value={tripData.currency} onValueChange={(value) => setTripData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">What is your estimated travel budget? (Optional)</Label>
                  <Input
                    id="budget"
                    placeholder="Enter your budget"
                    value={tripData.budget}
                    onChange={(e) => setTripData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>How many passengers? (Required)</Label>
                  <Select value={tripData.passengers} onValueChange={(value) => setTripData(prev => ({ ...prev, passengers: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 adult</SelectItem>
                      <SelectItem value="2">2 adults</SelectItem>
                      <SelectItem value="3">3 adults</SelectItem>
                      <SelectItem value="4">4 adults</SelectItem>
                      <SelectItem value="family">Family (2 adults + children)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferences">Any additional preferences? (Optional)</Label>
                  <Textarea
                    id="preferences"
                    placeholder="e.g., I want to visit specific landmarks, try local cooking classes, or have accessibility requirements..."
                    value={tripData.preferences}
                    onChange={(e) => setTripData(prev => ({ ...prev, preferences: e.target.value }))}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStep === 4 ? 'Generate Plan' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
