"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from '@iconify/react'
import { MapPin } from 'lucide-react'
import Link from "next/link"

export default function GeneratingPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      router.push('/plan-results')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

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
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <Icon icon="mdi:airplane" className="w-16 h-16 animate-bounce text-blue-600" />
                <Icon icon="mdi:arrow-right" className="w-8 h-8 text-gray-400 animate-pulse" />
                <Icon icon="mdi:robot-excited" className="w-16 h-16 animate-pulse text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Analyzing Feasibility...
              </h1>
              <p className="text-gray-600">
                We're evaluating your trip details to make sure everything fits your preferences and budget.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-800 font-medium">
                ✨ A quick 30-40 seconds is all it takes to assess feasibility
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
