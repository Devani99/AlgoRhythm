import { Loader2, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function LoadingScreen() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Feasibility Check</h2>
            <p className="text-gray-600">Reviewing your travel plan details.</p>
          </div>
          
          <div className="mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Feasibility...</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're evaluating your trip details to make sure everything fits your preferences and budget.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              A quick 30-40 seconds is all it takes to assess feasibility
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
