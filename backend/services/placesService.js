import axios from 'axios';

class PlacesService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
  }

  // Search for places by text query
  async searchPlaces(query, location = null, radius = 10000, type = null) {
    try {
      if (!this.googleApiKey) {
        // Return mock data if API key not available (for hackathon)
        return this.getMockPlaces(query);
      }

      const params = {
        query: query,
        key: this.googleApiKey,
        fields: 'place_id,name,formatted_address,geometry,rating,price_level,photos,types,opening_hours'
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = radius;
      }

      if (type) {
        params.type = type;
      }

      const response = await axios.get(`${this.baseUrl}/textsearch/json`, { params });

      return this.formatPlacesResponse(response.data.results);
    } catch (error) {
      console.error('Places Search Error:', error);
      throw new Error(`Failed to search places: ${error.message}`);
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId) {
    try {
      if (!this.googleApiKey || !placeId) {
        return this.getMockPlaceDetails();
      }

      const params = {
        place_id: placeId,
        key: this.googleApiKey,
        fields: 'place_id,name,formatted_address,geometry,rating,price_level,photos,reviews,opening_hours,formatted_phone_number,website,types,vicinity'
      };

      const response = await axios.get(`${this.baseUrl}/details/json`, { params });

      return this.formatPlaceDetails(response.data.result);
    } catch (error) {
      console.error('Place Details Error:', error);
      throw new Error(`Failed to get place details: ${error.message}`);
    }
  }

  // Find nearby places by type
  async findNearbyPlaces(location, radius = 1500, type = 'tourist_attraction') {
    try {
      if (!this.googleApiKey) {
        return this.getMockNearbyPlaces(type);
      }

      const params = {
        location: `${location.lat},${location.lng}`,
        radius: radius,
        type: type,
        key: this.googleApiKey
      };

      const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, { params });

      return this.formatPlacesResponse(response.data.results);
    } catch (error) {
      console.error('Nearby Places Error:', error);
      throw new Error(`Failed to find nearby places: ${error.message}`);
    }
  }

  // Get popular attractions for a city
  async getPopularAttractions(city, country, limit = 20) {
    try {
      const query = `popular attractions in ${city} ${country}`;
      const places = await this.searchPlaces(query);

      // Filter and sort by rating
      const attractions = places
        .filter(place => 
          place.types.some(type => 
            ['tourist_attraction', 'museum', 'park', 'monument', 'place_of_worship'].includes(type)
          )
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return attractions;
    } catch (error) {
      console.error('Attractions Error:', error);
      throw error;
    }
  }

  // Get restaurants for a location
  async getRestaurants(city, country, cuisine = null, priceLevel = null, limit = 15) {
    try {
      let query = `restaurants in ${city} ${country}`;
      if (cuisine) {
        query = `${cuisine} restaurants in ${city} ${country}`;
      }

      const places = await this.searchPlaces(query);

      let restaurants = places.filter(place => 
        place.types.includes('restaurant') || 
        place.types.includes('food') ||
        place.types.includes('meal_takeaway')
      );

      if (priceLevel) {
        restaurants = restaurants.filter(place => place.priceLevel === priceLevel);
      }

      return restaurants
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Restaurants Error:', error);
      throw error;
    }
  }

  // Get accommodation options
  async getAccommodations(city, country, type = 'lodging', limit = 10) {
    try {
      const query = `${type} in ${city} ${country}`;
      const places = await this.searchPlaces(query);

      const accommodations = places
        .filter(place => 
          place.types.some(t => ['lodging', 'hotel', 'hostel', 'guest_house'].includes(t))
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return accommodations;
    } catch (error) {
      console.error('Accommodations Error:', error);
      throw error;
    }
  }

  // Format places response from Google API
  formatPlacesResponse(places) {
    return places.map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types || [],
      photos: place.photos ? place.photos.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
        url: this.getPhotoUrl(photo.photo_reference, 400)
      })) : [],
      openingHours: place.opening_hours ? {
        isOpen: place.opening_hours.open_now,
        periods: place.opening_hours.periods || []
      } : null
    }));
  }

  // Format place details response
  formatPlaceDetails(place) {
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types || [],
      phoneNumber: place.formatted_phone_number,
      website: place.website,
      photos: place.photos ? place.photos.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
        url: this.getPhotoUrl(photo.photo_reference, 800)
      })) : [],
      reviews: place.reviews ? place.reviews.map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: new Date(review.time * 1000).toISOString(),
        profilePhoto: review.profile_photo_url
      })) : [],
      openingHours: place.opening_hours ? {
        isOpen: place.opening_hours.open_now,
        periods: place.opening_hours.periods || [],
        weekdayText: place.opening_hours.weekday_text || []
      } : null
    };
  }

  // Get photo URL from photo reference
  getPhotoUrl(photoReference, maxWidth = 400) {
    if (!this.googleApiKey) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.googleApiKey}`;
  }

  // Mock data for when API key is not available (hackathon fallback)
  getMockPlaces(query) {
    return [
      {
        placeId: 'mock_1',
        name: 'Popular Tourist Attraction',
        address: 'City Center, Main Street',
        location: { lat: 40.7128, lng: -74.0060 },
        rating: 4.5,
        priceLevel: 2,
        types: ['tourist_attraction', 'point_of_interest'],
        photos: [{ url: 'https://via.placeholder.com/400x300?text=Tourist+Attraction' }],
        openingHours: { isOpen: true }
      },
      {
        placeId: 'mock_2',
        name: 'Local Restaurant',
        address: 'Downtown Area, Food Street',
        location: { lat: 40.7589, lng: -73.9851 },
        rating: 4.2,
        priceLevel: 2,
        types: ['restaurant', 'food', 'point_of_interest'],
        photos: [{ url: 'https://via.placeholder.com/400x300?text=Restaurant' }],
        openingHours: { isOpen: true }
      },
      {
        placeId: 'mock_3',
        name: 'Cultural Museum',
        address: 'Arts District, Culture Avenue',
        location: { lat: 40.7831, lng: -73.9712 },
        rating: 4.7,
        priceLevel: 1,
        types: ['museum', 'tourist_attraction', 'point_of_interest'],
        photos: [{ url: 'https://via.placeholder.com/400x300?text=Museum' }],
        openingHours: { isOpen: false }
      }
    ];
  }

  getMockPlaceDetails() {
    return {
      placeId: 'mock_1',
      name: 'Popular Tourist Attraction',
      address: 'City Center, Main Street, 10001',
      location: { lat: 40.7128, lng: -74.0060 },
      rating: 4.5,
      priceLevel: 2,
      types: ['tourist_attraction', 'point_of_interest'],
      phoneNumber: '+1 (555) 123-4567',
      website: 'https://example.com',
      photos: [{ url: 'https://via.placeholder.com/800x600?text=Tourist+Attraction' }],
      reviews: [
        {
          author: 'John Doe',
          rating: 5,
          text: 'Amazing place to visit! Highly recommended.',
          time: new Date().toISOString()
        }
      ],
      openingHours: {
        isOpen: true,
        weekdayText: [
          'Monday: 9:00 AM – 6:00 PM',
          'Tuesday: 9:00 AM – 6:00 PM',
          'Wednesday: 9:00 AM – 6:00 PM',
          'Thursday: 9:00 AM – 6:00 PM',
          'Friday: 9:00 AM – 8:00 PM',
          'Saturday: 9:00 AM – 8:00 PM',
          'Sunday: 10:00 AM – 6:00 PM'
        ]
      }
    };
  }

  getMockNearbyPlaces(type) {
    const typeMap = {
      'restaurant': 'Restaurant',
      'tourist_attraction': 'Attraction',
      'lodging': 'Hotel',
      'shopping_mall': 'Shopping Center'
    };

    return [
      {
        placeId: `mock_${type}_1`,
        name: `Popular ${typeMap[type] || 'Place'}`,
        address: 'Nearby Location',
        location: { lat: 40.7128, lng: -74.0060 },
        rating: 4.3,
        priceLevel: 2,
        types: [type, 'point_of_interest'],
        photos: [{ url: `https://via.placeholder.com/400x300?text=${typeMap[type] || 'Place'}` }],
        openingHours: { isOpen: true }
      }
    ];
  }
}

export default new PlacesService();
