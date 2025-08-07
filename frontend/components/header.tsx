import { MapPin, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TravelAI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Community</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Plans</a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">Credits</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">5</span>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
