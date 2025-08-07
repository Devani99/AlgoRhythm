'use client'

import { useState } from 'react'
import { TravelPlanForm } from '@/components/travel-plan-form'
import { TravelPlanResult } from '@/components/travel-plan-result'
import { Header } from '@/components/header'

export interface TravelPlan {
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

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form')
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)

  const handlePlanComplete = (plan: TravelPlan) => {
    setTravelPlan(plan)
    setCurrentStep('result')
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
    setTravelPlan(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'form' ? (
          <TravelPlanForm onComplete={handlePlanComplete} />
        ) : (
          <TravelPlanResult plan={travelPlan!} onBack={handleBackToForm} />
        )}
      </main>
    </div>
  )
}
