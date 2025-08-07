"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, DollarSign, Users, Share2, Download, Sun, Cloud, Thermometer, Clock, Utensils, Bed, Camera, Backpack } from 'lucide-react'
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

// Mock data generator based on destination
const generateMockItinerary = (tripData: TripData) => {
  const destination = tripData.destination || "Paris"
  const startDate = new Date(tripData.startDate || "2024-06-01")
  const endDate = new Date(tripData.endDate || "2024-06-07")
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 6

  return {
    title: `A Memorable ${destination} Adventure`,
    description: `Experience the best of ${destination} with this carefully crafted itinerary that balances must-see attractions with hidden local gems.`,
    weather: {
      temperature: "18°C to 25°C",
      conditions: "Pleasant with occasional light showers",
      bestTime: "Perfect time to visit with comfortable temperatures and fewer crowds"
    },
    budget: {
      total: `$${Math.floor(Math.random() * 2000) + 1500} - $${Math.floor(Math.random() * 3000) + 2500}`,
      breakdown: [
        { category: "Accommodation", percentage: 40, amount: "$800 - $1200" },
        { category: "Food", percentage: 25, amount: "$500 - $750" },
        { category: "Activities", percentage: 20, amount: "$400 - $600" },
        { category: "Transport", percentage: 15, amount: "$300 - $450" }
      ]
    },
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      title: i === 0 ? `Arrival in ${destination}` : 
             i === days - 1 ? `Departure from ${destination}` :
             `Exploring ${destination} - Day ${i + 1}`,
      activities: {
        morning: i === 0 ? `Arrive in ${destination}. Check into accommodation and rest.` :
                 `Visit local attractions and landmarks`,
        afternoon: `Explore the city center and local markets`,
        evening: i === days - 1 ? `Departure preparations` : `Dinner at local restaurant`,
        night: i === days - 1 ? `Flight back home` : `Rest and prepare for tomorrow`
      },
      highlights: [
        "Local cultural experiences",
        "Must-see landmarks",
        "Hidden gems and local favorites"
      ]
    })),
    packingList: [
      { item: "Comfortable walking shoes", icon: "mdi:shoe-sneaker" },
      { item: "Weather-appropriate clothing", icon: "mdi:tshirt-crew" },
      { item: "Camera for capturing memories", icon: "mdi:camera" },
      { item: "Travel documents and copies", icon: "mdi:file-document" },
      { item: "Universal power adapter", icon: "mdi:power-plug" },
      { item: "Sunscreen and sunglasses", icon: "mdi:sunglasses" },
      { item: "Reusable water bottle", icon: "mdi:bottle-water" },
      { item: "Basic first aid kit", icon: "mdi:medical-bag" },
      { item: "Local currency and cards", icon: "mdi:credit-card" },
      { item: "Portable charger", icon: "mdi:battery-charging" }
    ]
  }
}

export default function PlanResultsPage() {
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [mockItinerary, setMockItinerary] = useState<any>(null)

  useEffect(() => {
    // Get trip data from localStorage
    const storedData = localStorage.getItem('tripData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setTripData(data)
      setMockItinerary(generateMockItinerary(data))
    }
  }, [])

  if (!tripData || !mockItinerary) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelAI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{tripData.destination}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {tripData.startDate} to {tripData.endDate}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {tripData.passengers} passenger{tripData.passengers !== "1" ? "s" : ""}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {tripData.budget ? `${tripData.currency} ${tripData.budget}` : "Budget flexible"}
            </div>
          </div>
          {tripData.themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tripData.themes.map((theme) => (
                <Badge key={theme} variant="secondary">{theme}</Badge>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="highlights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="highlights">Trip Highlights</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="packing">Packing</TabsTrigger>
          </TabsList>

          {/* Trip Highlights */}
          <TabsContent value="highlights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {mockItinerary.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {mockItinerary.description}
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Perfect For</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      {tripData.themes.slice(0, 3).map((theme) => (
                        <li key={theme}>• {theme}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Travel Style</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• {tripData.pace || "Balanced"} pace</li>
                      <li>• {tripData.accommodation || "Comfortable"} accommodation</li>
                      <li>• {tripData.transport || "Flexible"} transportation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Analysis */}
          <TabsContent value="weather">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Weather Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Icon icon="mdi:thermometer" className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-orange-900">Temperature</h4>
                    <p className="text-orange-800">{mockItinerary.weather.temperature}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Icon icon="mdi:weather-partly-cloudy" className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Conditions</h4>
                    <p className="text-blue-800">{mockItinerary.weather.conditions}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Icon icon="mdi:calendar-check" className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Best Time</h4>
                    <p className="text-green-800">Excellent timing!</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Weather Insights</h4>
                  <p className="text-gray-700">{mockItinerary.weather.bestTime}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary */}
          <TabsContent value="itinerary">
            <div className="space-y-4">
              {mockItinerary.itinerary.map((day: any) => (
                <Card key={day.day}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {day.day}
                      </div>
                      {day.title}
                    </CardTitle>
                    <CardDescription>{day.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:weather-sunny" className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-sm">Morning</span>
                        </div>
                        <p className="text-sm text-gray-600">{day.activities.morning}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:weather-sunset" className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-sm">Afternoon</span>
                        </div>
                        <p className="text-sm text-gray-600">{day.activities.afternoon}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:weather-night" className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-sm">Evening</span>
                        </div>
                        <p className="text-sm text-gray-600">{day.activities.evening}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:sleep" className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">Night</span>
                        </div>
                        <p className="text-sm text-gray-600">{day.activities.night}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget */}
          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Budget Breakdown
                </CardTitle>
                <CardDescription>
                  Total Estimated Cost: {mockItinerary.budget.total}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockItinerary.budget.breakdown.map((item: any) => (
                    <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {item.category === 'Accommodation' && <Icon icon="mdi:bed" className="w-6 h-6 text-blue-600" />}
                          {item.category === 'Food' && <Icon icon="mdi:silverware-fork-knife" className="w-6 h-6 text-blue-600" />}
                          {item.category === 'Activities' && <Icon icon="mdi:camera" className="w-6 h-6 text-blue-600" />}
                          {item.category === 'Transport' && <Icon icon="mdi:airplane-takeoff" className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.category}</h4>
                          <p className="text-sm text-gray-600">~{item.percentage}% of total budget</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packing List */}
          <TabsContent value="packing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Backpack className="w-5 h-5" />
                  Packing Checklist
                </CardTitle>
                <CardDescription>
                  Essential items for your {tripData.destination} trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockItinerary.packingList.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon icon={item.icon} className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">{item.item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/create-plan">
            <Button variant="outline">
              Create Another Plan
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Share2 className="w-4 h-4 mr-2" />
            Share This Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
