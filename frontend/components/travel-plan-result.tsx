'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Calendar, DollarSign, Package, ArrowLeft, Share2, Download, Sun, Cloud, Thermometer, Clock, Utensils, Bed, Camera, Mountain, Building } from 'lucide-react'
import { TravelPlan } from '@/app/page'

interface TravelPlanResultProps {
  plan: TravelPlan
  onBack: () => void
}

export function TravelPlanResult({ plan, onBack }: TravelPlanResultProps) {
  const [activeTab, setActiveTab] = useState('highlights')

  // Mock generated data based on the plan
  const mockItinerary = [
    {
      day: 1,
      date: plan.startDate,
      title: `Arrival in ${plan.destination}`,
      activities: [
        { time: 'Morning', activity: `Flight to ${plan.destination}`, icon: '✈️' },
        { time: 'Afternoon', activity: 'Check-in and rest at hotel', icon: '🏨' },
        { time: 'Evening', activity: 'Explore local area and dinner', icon: '🍽️' },
        { time: 'Night', activity: 'Rest and prepare for tomorrow', icon: '😴' }
      ],
      food: ['Try local welcome drink', 'Traditional dinner at hotel restaurant'],
      accommodation: `${plan.accommodation || '4 Star'} Hotel`,
      tips: 'Take it easy on the first day to adjust to the new environment'
    },
    {
      day: 2,
      date: new Date(new Date(plan.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      title: `Exploring ${plan.destination}`,
      activities: [
        { time: 'Morning', activity: 'Visit main attractions', icon: '🏛️' },
        { time: 'Afternoon', activity: 'Local market and shopping', icon: '🛍️' },
        { time: 'Evening', activity: 'Cultural show or local entertainment', icon: '🎭' },
        { time: 'Night', activity: 'Dinner at recommended restaurant', icon: '🍽️' }
      ],
      food: ['Local breakfast specialties', 'Street food tour', 'Fine dining experience'],
      accommodation: `${plan.accommodation || '4 Star'} Hotel`,
      tips: 'Carry a camera and comfortable walking shoes'
    }
  ]

  const mockBudget = {
    total: { min: 2000, max: 4000 },
    breakdown: [
      { category: 'Accommodation', percentage: 41, min: 820, max: 1640 },
      { category: 'Food', percentage: 20, min: 400, max: 800 },
      { category: 'Transport', percentage: 25, min: 500, max: 1000 },
      { category: 'Activities', percentage: 10, min: 200, max: 400 },
      { category: 'Contingency', percentage: 4, min: 80, max: 160 }
    ]
  }

  const packingList = [
    'Comfortable walking shoes',
    'Weather-appropriate clothing',
    'Camera for capturing memories',
    'Universal travel adapter',
    'Reusable water bottle',
    'Sunglasses and sunscreen',
    'Travel documents (ID, passport, tickets)',
    'Basic first aid kit',
    'Power bank and chargers',
    'Local currency and cards'
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Travel Plan</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{plan.startLocation} → {plan.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{plan.startDate} to {plan.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="highlights">Trip Highlights</TabsTrigger>
          <TabsTrigger value="weather">Weather Analysis</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget Range</TabsTrigger>
          <TabsTrigger value="packing">Packing List</TabsTrigger>
        </TabsList>

        {/* Trip Highlights */}
        <TabsContent value="highlights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                A Memorable {plan.destination} Adventure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                🏞️ Beautiful {plan.destination} Landscape
              </div>
              
              <div className="prose max-w-none">
                <p>
                  Your journey begins with an exciting trip to {plan.destination}, carefully crafted based on your preferences for {plan.themes?.join(', ') || 'adventure and exploration'}. 
                  This {Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))}-day adventure promises unforgettable experiences.
                </p>
                
                <p>
                  Starting from {plan.startLocation}, you'll discover the best of {plan.destination} with a perfect balance of {plan.pace || 'balanced'} paced activities. 
                  Your accommodation preference for {plan.accommodation || '4-star'} stays ensures comfort throughout your journey.
                </p>
                
                <p>
                  The itinerary includes visits to iconic landmarks, hidden local gems, and authentic cultural experiences. 
                  With your preference for {plan.weather || 'pleasant'} weather and {plan.food?.join(', ') || 'local'} cuisine, 
                  every moment is designed to create lasting memories.
                </p>
                
                {plan.preferences && (
                  <p>
                    Special attention has been given to your specific requests: "{plan.preferences}"
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-blue-900">Cultural Sites</h3>
                  <p className="text-sm text-blue-700">Explore historical landmarks and museums</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Mountain className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-green-900">Natural Wonders</h3>
                  <p className="text-sm text-green-700">Discover scenic landscapes and nature</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Utensils className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-purple-900">Local Cuisine</h3>
                  <p className="text-sm text-purple-700">Taste authentic local flavors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weather Analysis */}
        <TabsContent value="weather" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Expected Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <span className="text-blue-700 font-semibold">22°C - 28°C</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Weather</span>
                    </div>
                    <span className="text-blue-700 font-semibold">{plan.weather || 'Pleasant'}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {plan.destination} during your travel dates experiences {plan.weather?.toLowerCase() || 'pleasant'} conditions, 
                    perfect for the activities you've selected. The weather aligns well with your preferences for outdoor exploration.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Best Time To Visit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Excellent Choice!</h3>
                    <p className="text-sm text-green-700">
                      Your selected travel dates are ideal for visiting {plan.destination}. 
                      The weather conditions will be perfect for your planned activities.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">What to Expect:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Clear skies and comfortable temperatures</li>
                      <li>• Perfect conditions for {plan.themes?.join(' and ') || 'sightseeing'}</li>
                      <li>• Ideal weather for {plan.transport?.toLowerCase() || 'travel'}</li>
                      <li>• Great visibility for photography</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Itinerary */}
        <TabsContent value="itinerary" className="mt-6">
          <div className="space-y-6">
            {mockItinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Day {day.day}: {day.title}</span>
                    <Badge variant="outline">{day.date}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Daily Schedule
                      </h4>
                      <div className="space-y-3">
                        {day.activities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                            <span className="text-lg">{activity.icon}</span>
                            <div>
                              <div className="font-medium text-sm text-blue-600">{activity.time}</div>
                              <div className="text-sm text-gray-700">{activity.activity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          Food Recommendations
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {day.food.map((food, index) => (
                            <li key={index}>• {food}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          Stay Options
                        </h4>
                        <p className="text-sm text-gray-600">{day.accommodation}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-1">💡 Tip</h4>
                        <p className="text-sm text-blue-700">{day.tips}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Budget Range */}
        <TabsContent value="budget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Breakdown
              </CardTitle>
              <CardDescription>
                Estimated costs for your {plan.passengers || '1 adult'} trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.currency || 'USD'} {mockBudget.total.min.toLocaleString()} - {mockBudget.total.max.toLocaleString()}
                </div>
                <p className="text-gray-600">Total Estimated Cost</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {mockBudget.breakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm text-gray-500">~{item.percentage}% of total budget</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {plan.currency || 'USD'} {item.min} - {item.max}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">💰 Budget Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Book accommodations early for better rates</li>
                  <li>• Consider local transportation for cost savings</li>
                  <li>• Try street food for authentic and affordable meals</li>
                  <li>• Look for free walking tours and activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packing List */}
        <TabsContent value="packing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Packing Checklist
              </CardTitle>
              <CardDescription>
                Essential items for your {plan.destination} trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {packingList.map((item, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🌡️ Weather-Specific</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Light jacket for evenings</li>
                    <li>• Comfortable walking shoes</li>
                    <li>• Sun hat and sunglasses</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">📱 Tech Essentials</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Phone charger and power bank</li>
                    <li>• Universal adapter</li>
                    <li>• Camera with extra batteries</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">🏥 Health & Safety</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• First aid kit</li>
                    <li>• Personal medications</li>
                    <li>• Hand sanitizer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
