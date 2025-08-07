import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, DollarSign, Users, Sparkles, Clock } from 'lucide-react'
import { Icon } from '@iconify/react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelAI
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900">Community</Link>
            <Button variant="outline" size="sm">Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Travel Companion
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create personalized, day-by-day travel itineraries in seconds. Just tell us your destination, 
            preferences, and budget — we'll handle the rest.
          </p>
          <Link href="/create-plan">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Planning Your Trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TravelAI?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the future of travel planning with our intelligent assistant
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Icon icon="mdi:clock-fast" className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Instant Planning</CardTitle>
              <CardDescription>
                Get complete itineraries in under 30 seconds
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Icon icon="mdi:map-marker-path" className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Personalized Routes</CardTitle>
              <CardDescription>
                Tailored to your interests, budget, and travel style
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Icon icon="mdi:account-group" className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Local Insights</CardTitle>
              <CardDescription>
                Hidden gems and local tips from our AI knowledge base
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to your perfect trip</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "mdi:map-search", title: "Choose Destination", desc: "Tell us where you want to go" },
              { icon: "mdi:tune", title: "Set Preferences", desc: "Dates, budget, and interests" },
              { icon: "mdi:robot-excited", title: "AI Magic", desc: "Our AI creates your itinerary" },
              { icon: "mdi:airplane-takeoff", title: "Start Exploring", desc: "Get your personalized plan" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon={step.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelAI for their perfect trips
          </p>
          <Link href="/create-plan">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Your First Plan
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">TravelAI</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 TravelAI. Built for hackathon purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
