import OpenAI from 'openai';
import axios from 'axios';

class AIService {
  constructor() {
    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Groq client (free alternative)
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
  }

  // Main method to generate travel itinerary
  async generateItinerary(tripData) {
    try {
      const prompt = this.buildItineraryPrompt(tripData);

      // Try different AI providers in order of preference
      let response;

      if (this.openai) {
        response = await this.generateWithOpenAI(prompt);
      } else if (this.groqApiKey) {
        response = await this.generateWithGroq(prompt);
      } else if (this.huggingfaceApiKey) {
        response = await this.generateWithHuggingFace(prompt);
      } else {
        throw new Error('No AI API key configured');
      }

      return this.parseItineraryResponse(response, tripData);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }

  // Build the prompt for itinerary generation
  buildItineraryPrompt(tripData) {
    const {
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      preferences,
      budget
    } = tripData;

    const prompt = `
You are an expert travel planner. Create a detailed ${duration}-day itinerary for a trip to ${destination.city}, ${destination.country}.

TRIP DETAILS:
- Destination: ${destination.city}, ${destination.country}
- Start Date: ${startDate}
- End Date: ${endDate}
- Duration: ${duration} days
- Travelers: ${travelers.adults} adults, ${travelers.children || 0} children, ${travelers.infants || 0} infants
- Budget: ${budget?.total || 'Not specified'} ${budget?.currency || 'USD'}
- Travel Pace: ${preferences?.pace || 'moderate'}
- Themes: ${preferences?.themes?.join(', ') || 'General sightseeing'}
- Food Preferences: ${preferences?.foodPreferences?.join(', ') || 'No restrictions'}
- Transport Preference: ${preferences?.transportPreference || 'mixed'}

REQUIREMENTS:
1. Create a day-by-day itinerary with 3-4 activities per day
2. Include realistic time slots (format: "HH:MM")
3. Provide estimated costs in ${budget?.currency || 'USD'}
4. Include a mix of activities based on the specified themes
5. Consider the travel pace when scheduling activities
6. Include local cuisine recommendations
7. Suggest appropriate transportation between activities
8. Consider the group composition when recommending activities

RESPONSE FORMAT - Return a valid JSON object with this structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme description",
      "activities": [
        {
          "name": "Activity name",
          "description": "Brief description",
          "category": "sightseeing|food|activity|transport|accommodation|shopping|entertainment|other",
          "location": {
            "name": "Location name",
            "address": "Full address if known"
          },
          "duration": {
            "hours": 2,
            "minutes": 30
          },
          "estimatedCost": {
            "min": 10,
            "max": 25,
            "currency": "${budget?.currency || 'USD'}"
          },
          "timeSlot": {
            "startTime": "09:00",
            "endTime": "11:30"
          },
          "priority": "low|medium|high",
          "bookingInfo": {
            "isBookingRequired": false,
            "contactInfo": "Contact details if needed"
          },
          "notes": "Additional notes or tips"
        }
      ],
      "totalEstimatedCost": {
        "amount": 150,
        "currency": "${budget?.currency || 'USD'}"
      },
      "notes": "Daily summary or special notes"
    }
  ],
  "totalBudgetEstimate": {
    "amount": 1000,
    "currency": "${budget?.currency || 'USD'}",
    "breakdown": {
      "accommodation": 400,
      "food": 300,
      "activities": 200,
      "transportation": 100
    }
  },
  "generalTips": [
    "Important travel tip 1",
    "Important travel tip 2"
  ],
  "bestTimeToVisit": "Information about weather and seasons",
  "localCustoms": "Brief cultural notes and etiquette tips"
}

Ensure all JSON is properly formatted and all dates are in YYYY-MM-DD format. Make the itinerary practical, engaging, and tailored to the specified preferences.
    `;

    return prompt.trim();
  }

  // Generate with OpenAI
  async generateWithOpenAI(prompt) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner who creates detailed, practical, and personalized travel itineraries. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw error;
    }
  }

  // Generate with Groq (free alternative)
  async generateWithGroq(prompt) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel planner who creates detailed, practical, and personalized travel itineraries. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq Error:', error);
      throw error;
    }
  }

  // Generate with HuggingFace (another free alternative)
  async generateWithHuggingFace(prompt) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
          inputs: prompt,
          parameters: {
            max_length: 4000,
            temperature: 0.7,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error('HuggingFace Error:', error);
      throw error;
    }
  }

  // Parse the AI response and format for database
  parseItineraryResponse(response, tripData) {
    try {
      // Clean the response to ensure it's valid JSON
      let cleanResponse = response.trim();

      // Remove any markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\n?|```/g, '');

      // Remove any leading/trailing whitespace
      cleanResponse = cleanResponse.trim();

      const parsed = JSON.parse(cleanResponse);

      // Validate the parsed response has required structure
      if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
        throw new Error('Invalid itinerary structure in AI response');
      }

      // Format dates and add missing fields
      parsed.itinerary.forEach((day, index) => {
        // Ensure proper date format
        const dayDate = new Date(tripData.startDate);
        dayDate.setDate(dayDate.getDate() + index);
        day.date = dayDate.toISOString().split('T')[0];
        day.day = index + 1;

        // Validate and format activities
        day.activities = day.activities.map(activity => ({
          name: activity.name || 'Unnamed Activity',
          description: activity.description || '',
          category: activity.category || 'other',
          location: {
            name: activity.location?.name || '',
            address: activity.location?.address || '',
            coordinates: activity.location?.coordinates || {}
          },
          duration: {
            hours: activity.duration?.hours || 2,
            minutes: activity.duration?.minutes || 0
          },
          estimatedCost: {
            min: activity.estimatedCost?.min || 0,
            max: activity.estimatedCost?.max || 0,
            currency: activity.estimatedCost?.currency || tripData.budget?.currency || 'USD'
          },
          timeSlot: {
            startTime: activity.timeSlot?.startTime || '09:00',
            endTime: activity.timeSlot?.endTime || '11:00'
          },
          priority: activity.priority || 'medium',
          bookingInfo: {
            isBookingRequired: activity.bookingInfo?.isBookingRequired || false,
            bookingUrl: activity.bookingInfo?.bookingUrl || '',
            contactInfo: activity.bookingInfo?.contactInfo || ''
          },
          notes: activity.notes || '',
          completed: false
        }));
      });

      return {
        itinerary: parsed.itinerary,
        totalBudgetEstimate: parsed.totalBudgetEstimate || {
          amount: 0,
          currency: tripData.budget?.currency || 'USD',
          breakdown: {}
        },
        generalTips: parsed.generalTips || [],
        bestTimeToVisit: parsed.bestTimeToVisit || '',
        localCustoms: parsed.localCustoms || '',
        aiGenerated: true,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  // Generate activity suggestions for a specific day
  async generateActivitySuggestions(destination, preferences, existingActivities = []) {
    try {
      const prompt = `
Suggest 5 unique activities for ${destination.city}, ${destination.country} that match these preferences:
- Themes: ${preferences.themes?.join(', ') || 'general sightseeing'}
- Pace: ${preferences.pace || 'moderate'}

Avoid these activities (already planned): ${existingActivities.map(a => a.name).join(', ')}

Return a JSON array of activity suggestions with this format:
[
  {
    "name": "Activity name",
    "description": "Brief description",
    "category": "category",
    "estimatedDuration": "2 hours",
    "estimatedCost": "15-25 USD",
    "bestTimeToVisit": "Morning/Afternoon/Evening",
    "tips": "Helpful tips"
  }
]
      `;

      let response;
      if (this.openai) {
        response = await this.generateWithOpenAI(prompt);
      } else if (this.groqApiKey) {
        response = await this.generateWithGroq(prompt);
      } else {
        throw new Error('No AI API key configured');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating activity suggestions:', error);
      throw error;
    }
  }
}

export default new AIService();
