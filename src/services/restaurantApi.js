import axios from 'axios';

const API_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

export const getRestaurants = async () => {
  const query = `
    [out:json][timeout:30];
    nwr["amenity"~"restaurant|cafe"]
    (around:5000,15.4989,73.8278);
    out center;
  `;

  for (const url of API_URLS) {
    try {
      console.log('Trying restaurant API:', url);

      const response = await axios.post(
        url,
        new URLSearchParams({ data: query }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 35000,
        }
      );

      const restaurants = response.data.elements || [];

      if (restaurants.length > 0) {
        console.log('Restaurants found:', restaurants.length);
        return restaurants;
      }
    } catch (error) {
      console.log('API server failed:', url);
    }
  }

  console.log('All restaurant API servers failed.');

  // Temporary sample data if all API servers are unavailable
  return [
    {
      id: 1001,
      tags: {
        name: 'Goa Food Corner',
        amenity: 'restaurant',
        cuisine: 'Indian',
        'addr:street': 'Panjim, Goa',
      },
    },
    {
      id: 1002,
      tags: {
        name: 'Pizza House',
        amenity: 'restaurant',
        cuisine: 'Pizza',
        'addr:street': 'Panjim, Goa',
      },
    },
    {
      id: 1003,
      tags: {
        name: 'Cafe Delight',
        amenity: 'cafe',
        cuisine: 'Coffee and Snacks',
        'addr:street': 'Panjim, Goa',
      },
    },
  ];
};
