'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, DollarSign, Plane, Car, Train, Bus } from 'lucide-react'
import { TravelPlan } from '@/app/page'
import { LoadingScreen } from '@/components/loading-screen'

interface TravelPlanFormProps {
  onComplete: (plan: TravelPlan) => void
}

export function TravelPlanForm({ onComplete }: TravelPlanFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<TravelPlan>>({
    themes: [],
    food: []
  })

  const totalSteps = 4

  const travelThemes = [
    'Historical Sites and Landmarks',
    'Adventure',
    'For the Gram',
    'Shopping & Relaxation',
    'Local Culture',
    'Beaches',
    'Hills, Nature and Wildlife',
    'Nightlife'
  ]

  const foodPreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Halal',
    'Kosher',
    'Local Cuisine'
  ]

  const handleThemeToggle = (theme: string) => {
    const currentThemes = formData.themes || []
    if (currentThemes.includes(theme)) {
      setFormData({
        ...formData,
        themes: currentThemes.filter(t => t !== theme)
      })
    } else {
      setFormData({
        ...formData,
        themes: [...currentThemes, theme]
      })
    }
  }

  const handleFoodToggle = (food: string) => {
    const currentFood = formData.food || []
    if (currentFood.includes(food)) {
      setFormData({
        ...formData,
        food: currentFood.filter(f => f !== food)
      })
    } else {
      setFormData({
        ...formData,
        food: [...currentFood, food]
      })
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsLoading(false)
    onComplete(formData as TravelPlan)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create a Plan</h2>
          <p className="text-gray-600 mt-2">
            {currentStep === 1 && "Set the Course, Own the Journey"}
            {currentStep === 2 && "Craft Your Comfort Zone"}
            {currentStep === 3 && "Trip Budget & Travel Companions"}
            {currentStep === 4 && "Final Details"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Step 1: Destination and Dates */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startLocation" className="text-base font-medium">
                    Where are you starting your trip from?
                  </Label>
                  <Input
                    id="startLocation"
                    placeholder="Enter your start city here..."
                    value={formData.startLocation || ''}
                    onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="destination" className="text-base font-medium">
                    Search for your destination country/city
                  </Label>
                  <Input
                    id="destination"
                    placeholder="Search for places..."
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate" className="text-base font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-base font-medium">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Which of these travel themes best describes your dream getaway? (Optional)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {travelThemes.map((theme) => (
                    <Badge
                      key={theme}
                      variant={formData.themes?.includes(theme) ? "default" : "outline"}
                      className="cursor-pointer p-3 text-center justify-center hover:bg-blue-50"
                      onClick={() => handleThemeToggle(theme)}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What pace of travel do you prefer? (Optional)
                  </Label>
                  <div className="space-y-2">
                    {['Slow and Easy', 'Balanced', 'Fast'].map((pace) => (
                      <label key={pace} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pace"
                          value={pace}
                          checked={formData.pace === pace}
                          onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
                          className="text-blue-600"
                        />
                        <span>{pace}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What kind of weather do you prefer? (Optional)
                  </Label>
                  <div className="space-y-2">
                    {['Warm and Sunny', 'Cool and Breezy', 'Cold and Snowy', 'Mild and Pleasant', 'Rainy and Cozy'].map((weather) => (
                      <label key={weather} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="weather"
                          value={weather}
                          checked={formData.weather === weather}
                          onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                          className="text-blue-600"
                        />
                        <span>{weather}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What type of accommodation would you prefer? (Optional)
                  </Label>
                  <div className="space-y-2">
                    {['3 Star', '4 Star', '5 Star', 'Airbnb', 'Homestay', 'Hostel'].map((accommodation) => (
                      <label key={accommodation} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accommodation"
                          value={accommodation}
                          checked={formData.accommodation === accommodation}
                          onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                          className="text-blue-600"
                        />
                        <span>{accommodation}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What type of food would you like to enjoy? (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {foodPreferences.map((food) => (
                      <Badge
                        key={food}
                        variant={formData.food?.includes(food) ? "default" : "outline"}
                        className="cursor-pointer p-2 text-center justify-center hover:bg-blue-50"
                        onClick={() => handleFoodToggle(food)}
                      >
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  How would you like to travel from departure to destination? (Optional)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Flights', icon: Plane },
                    { name: 'Trains', icon: Train },
                    { name: 'Buses', icon: Bus },
                    { name: 'Road', icon: Car }
                  ].map(({ name, icon: Icon }) => (
                    <label key={name} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-blue-50">
                      <input
                        type="radio"
                        name="transport"
                        value={name}
                        checked={formData.transport === name}
                        onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                        className="text-blue-600"
                      />
                      <Icon className="h-4 w-4" />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget and Passengers */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currency" className="text-base font-medium">
                    Which currency would you like to use? (Optional)
                  </Label>
                  <select
                    id="currency"
                    value={formData.currency || 'USD'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="budget" className="text-base font-medium">
                    What is your estimated travel budget? (Optional)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter budget amount"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="passengers" className="text-base font-medium">
                  How many passengers? (Required)
                </Label>
                <select
                  id="passengers"
                  value={formData.passengers || '1 adult'}
                  onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1 adult">1 adult</option>
                  <option value="2 adults">2 adults</option>
                  <option value="3 adults">3 adults</option>
                  <option value="4 adults">4 adults</option>
                  <option value="1 adult, 1 child">1 adult, 1 child</option>
                  <option value="2 adults, 1 child">2 adults, 1 child</option>
                  <option value="2 adults, 2 children">2 adults, 2 children</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Additional Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="preferences" className="text-base font-medium">
                  Any additional preferences or specific places/activities you'd like to include? (Optional)
                </Label>
                <Textarea
                  id="preferences"
                  placeholder="e.g., I want to visit the Eiffel Tower, go parasailing, or try local cooking classes..."
                  value={formData.preferences || ''}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Trip Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>From:</strong> {formData.startLocation || 'Not specified'}</p>
                    <p><strong>To:</strong> {formData.destination || 'Not specified'}</p>
                    <p><strong>Dates:</strong> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : 'Not specified'}</p>
                  </div>
                  <div>
                    <p><strong>Passengers:</strong> {formData.passengers || '1 adult'}</p>
                    <p><strong>Budget:</strong> {formData.budget ? `${formData.currency || 'USD'} ${formData.budget}` : 'Not specified'}</p>
                    <p><strong>Themes:</strong> {formData.themes?.length ? formData.themes.join(', ') : 'None selected'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Generate My Travel Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
