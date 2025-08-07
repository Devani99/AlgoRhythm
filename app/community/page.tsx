import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Heart, MessageCircle, Share2, Calendar, DollarSign, Users } from 'lucide-react'
import { Icon } from '@iconify/react'

const communityPlans = [
  {
    id: 1,
    title: "Ultimate Tokyo Adventure",
    destination: "Tokyo, Japan",
    author: "Sarah Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "7 days",
    budget: "$2,800",
    passengers: "2 adults",
    likes: 124,
    comments: 18,
    tags: ["Culture", "Food", "Adventure"],
    description: "Experience the perfect blend of traditional and modern Tokyo with this carefully crafted itinerary.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:torii-gate"
  },
  {
    id: 2,
    title: "Romantic Paris Getaway",
    destination: "Paris, France",
    author: "Mike Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "5 days",
    budget: "$2,200",
    passengers: "2 adults",
    likes: 89,
    comments: 12,
    tags: ["Romance", "Culture", "Food"],
    description: "A romantic journey through the City of Light with intimate dining and iconic landmarks.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:eiffel-tower"
  },
  {
    id: 3,
    title: "Bali Wellness Retreat",
    destination: "Bali, Indonesia",
    author: "Emma Wilson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "10 days",
    budget: "$1,500",
    passengers: "1 adult",
    likes: 156,
    comments: 24,
    tags: ["Wellness", "Nature", "Relaxation"],
    description: "Rejuvenate your mind and body with this wellness-focused Bali experience.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:palm-tree"
  },
  {
    id: 4,
    title: "Iceland Northern Lights",
    destination: "Reykjavik, Iceland",
    author: "Alex Thompson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "6 days",
    budget: "$3,200",
    passengers: "2 adults",
    likes: 203,
    comments: 31,
    tags: ["Nature", "Photography", "Adventure"],
    description: "Chase the Northern Lights and explore Iceland's stunning natural wonders.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:snowflake"
  },
  {
    id: 5,
    title: "Thailand Island Hopping",
    destination: "Thailand",
    author: "Lisa Park",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "12 days",
    budget: "$1,800",
    passengers: "2 adults",
    likes: 178,
    comments: 27,
    tags: ["Beaches", "Adventure", "Culture"],
    description: "Discover the most beautiful islands of Thailand with this comprehensive guide.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:island"
  },
  {
    id: 6,
    title: "New York City Explorer",
    destination: "New York, USA",
    author: "David Rodriguez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    duration: "4 days",
    budget: "$2,500",
    passengers: "Family (4)",
    likes: 92,
    comments: 15,
    tags: ["City", "Culture", "Entertainment"],
    description: "The ultimate NYC experience for families with kids-friendly activities and must-see attractions.",
    image: "/placeholder.svg?height=200&width=300",
    icon: "mdi:city"
  }
]

export default function CommunityPage() {
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
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/community" className="text-blue-600 font-medium">Community</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Community</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover amazing travel plans shared by fellow travelers. Get inspired and share your own adventures!
          </p>
          <Link href="/create-plan">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Share Your Plan
            </Button>
          </Link>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["All", "Adventure", "Culture", "Food", "Nature", "Romance", "Beaches", "City"].map((tag) => (
            <Button
              key={tag}
              variant={tag === "All" ? "default" : "outline"}
              size="sm"
              className={tag === "All" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Community Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={plan.image || "/placeholder.svg"} 
                  alt={plan.destination}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={plan.authorAvatar || "/placeholder.svg"} alt={plan.author} />
                      <AvatarFallback>{plan.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{plan.author}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon={plan.icon} className="w-4 h-4" />
                  {plan.destination}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {plan.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {plan.budget}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {plan.passengers}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {plan.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                      <Icon icon="mdi:heart" className="w-4 h-4" />
                      {plan.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <Icon icon="mdi:comment" className="w-4 h-4" />
                      {plan.comments}
                    </button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon icon="mdi:share-variant" className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Plans
          </Button>
        </div>
      </div>
    </div>
  )
}
