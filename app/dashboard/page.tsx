import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Calendar, Users, DollarSign } from 'lucide-react'
import { Icon } from '@iconify/react'

const mockTrips = [
  {
    id: 1,
    destination: "Paris, France",
    dates: "Jun 15 - Jun 22, 2024",
    passengers: "2 adults",
    budget: "$2,500",
    status: "Completed",
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    dates: "Aug 10 - Aug 18, 2024",
    passengers: "1 adult",
    budget: "$3,200",
    status: "Upcoming",
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 3,
    destination: "Bali, Indonesia",
    dates: "Dec 20 - Dec 28, 2024",
    passengers: "2 adults",
    budget: "$1,800",
    status: "Planning",
    image: "/placeholder.svg?height=200&width=300"
  }
]

export default function DashboardPage() {
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900">Community</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Travel Plans</h1>
            <p className="text-gray-600">Manage and track your AI-generated travel itineraries</p>
          </div>
          <Link href="/create-plan">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Plan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-xs text-green-600">+2 this month</p>
                </div>
                <Icon icon="mdi:airplane-takeoff" className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Countries Visited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <p className="text-xs text-blue-600">Across 3 continents</p>
                </div>
                <Icon icon="mdi:earth" className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">$18,500</div>
                  <p className="text-xs text-purple-600">Average $1,540/trip</p>
                </div>
                <Icon icon="mdi:cash-multiple" className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <p className="text-xs text-orange-600">Next: Tokyo in 2 weeks</p>
                </div>
                <Icon icon="mdi:calendar-clock" className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={trip.image || "/placeholder.svg"} 
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    trip.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {trip.destination}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {trip.dates}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {trip.passengers}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  {trip.budget}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for New Users */}
        {mockTrips.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">Start planning your first AI-powered adventure!</p>
              <Link href="/create-plan">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
