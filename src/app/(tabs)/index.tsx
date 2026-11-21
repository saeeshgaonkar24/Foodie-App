import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getRestaurants } from '../../services/restaurantApi';

// Restaurant images
const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
];

// Demo restaurants for categories
// These are sample listings, not verified real businesses.
const categoryDemoRestaurants: Record<string, any[]> = {
  Biryani: [
    {
      id: 'demo-biryani-1',
      tags: {
        name: 'Royal Biryani House',
        amenity: 'restaurant',
        cuisine: 'Biryani, Indian, Mughlai',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-biryani-2',
      tags: {
        name: 'Hyderabadi Dum Biryani',
        amenity: 'restaurant',
        cuisine: 'Hyderabadi Biryani, Indian',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-biryani-3',
      tags: {
        name: 'Spice Biryani Corner',
        amenity: 'restaurant',
        cuisine: 'Chicken Biryani, Indian',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
  ],

  Burger: [
    {
      id: 'demo-burger-1',
      tags: {
        name: 'Burger Junction',
        amenity: 'restaurant',
        cuisine: 'Burgers, Fast Food',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-burger-2',
      tags: {
        name: 'The Burger Hub',
        amenity: 'restaurant',
        cuisine: 'Cheese Burger, Fast Food',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-burger-3',
      tags: {
        name: 'Classic Burger Cafe',
        amenity: 'restaurant',
        cuisine: 'Veg Burger, Chicken Burger',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
  ],

  Chinese: [
    {
      id: 'demo-chinese-1',
      tags: {
        name: 'Dragon Chinese Kitchen',
        amenity: 'restaurant',
        cuisine: 'Chinese, Noodles',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-chinese-2',
      tags: {
        name: 'Wok Express',
        amenity: 'restaurant',
        cuisine: 'Chinese, Asian',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-chinese-3',
      tags: {
        name: 'Chinese Food Corner',
        amenity: 'restaurant',
        cuisine: 'Chinese, Fried Rice, Noodles',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
  ],

  Cake: [
    {
      id: 'demo-cake-1',
      tags: {
        name: 'Sweet Treats Bakery',
        amenity: 'restaurant',
        cuisine: 'Cakes, Bakery, Desserts',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-cake-2',
      tags: {
        name: 'Chocolate Cake House',
        amenity: 'restaurant',
        cuisine: 'Chocolate Cake, Pastries',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
    {
      id: 'demo-cake-3',
      tags: {
        name: 'The Dessert Corner',
        amenity: 'restaurant',
        cuisine: 'Cakes, Desserts, Bakery',
        'addr:street': 'Panjim, Goa',
      },
      isDemo: true,
    },
  ],
};

// Categories
const categories = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Biryani', emoji: '🍛' },
  { name: 'Cake', emoji: '🎂' },
  { name: 'Drinks', emoji: '🥤' },
  { name: 'Chinese', emoji: '🍜' },
];

// Category search keywords
const categoryKeywords: Record<string, string[]> = {
  Pizza: ['pizza', 'pizzeria'],
  Burger: ['burger', 'hamburger'],
  Biryani: [
    'biryani',
    'biriyani',
    'briyani',
    'hyderabadi',
    'dum biryani',
    'mughlai',
  ],
  Cake: ['cake', 'bakery', 'dessert', 'pastry'],
  Drinks: ['drink', 'juice', 'coffee', 'cafe'],
  Chinese: ['chinese', 'noodle', 'asian', 'sushi'],
};

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const data = await getRestaurants();

        const namedRestaurants = data.filter(
          (item: any) => item.tags?.name
        );

        setRestaurants(namedRestaurants);
      } catch (error) {
        console.log('Restaurant fetching error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Search and category filtering
  const filteredRestaurants = restaurants.filter((item: any) => {
    const name = (item.tags?.name || '').toLowerCase();
    const cuisine = (item.tags?.cuisine || '').toLowerCase();

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      cuisine.includes(search.toLowerCase());

    const keywords = categoryKeywords[selectedCategory];

    const matchesCategory =
      selectedCategory === 'All' ||
      keywords?.some(keyword =>
        name.includes(keyword) || cuisine.includes(keyword)
      );

    return matchesSearch && matchesCategory;
  });

  // Use demo restaurants if no real API matches exist
  const displayedRestaurants =
    filteredRestaurants.length > 0
      ? filteredRestaurants
      : (categoryDemoRestaurants[selectedCategory] || []).filter(
          (item: any) => {
            const searchText = search.toLowerCase();

            return (
              item.tags.name.toLowerCase().includes(searchText) ||
              item.tags.cuisine.toLowerCase().includes(searchText)
            );
          }
        );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Location */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>DELIVER TO</Text>
            <Text style={styles.location}>📍 Panjim, Goa ▼</Text>
          </View>

          <View style={styles.profile}>
            <Text style={styles.profileText}>👤</Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.title}>Hungry?</Text>
          <Text style={styles.subtitle}>
            Discover delicious food near you!
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            placeholder="Search restaurants or food..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.offer}>SPECIAL OFFER</Text>
            <Text style={styles.bannerTitle}>Hungry?</Text>

            <Text style={styles.bannerDescription}>
              Get delicious food delivered!
            </Text>

            <Text style={styles.discount}>UP TO 30% OFF</Text>
          </View>

          <Text style={styles.bannerEmoji}>🍔</Text>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>
          What's on your mind?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.category}
              onPress={() => {
                setSelectedCategory(item.name);
                setSearch('');
              }}
            >
              <View
                style={[
                  styles.categoryCircle,
                  selectedCategory === item.name &&
                    styles.selectedCategory,
                ]}
              >
                <Text style={styles.categoryEmoji}>
                  {item.emoji}
                </Text>
              </View>

              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === item.name &&
                    styles.selectedCategoryName,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Restaurant List */}
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All'
            ? 'Restaurants Near You'
            : `${selectedCategory} Restaurants`}
        </Text>

        <Text style={styles.sectionSubtitle}>
          Discover restaurants around Panjim
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#E94435"
            style={{ marginTop: 20 }}
          />
        ) : displayedRestaurants.length === 0 ? (
          <Text style={styles.noResults}>
            No matching restaurants found. Try another category.
          </Text>
        ) : (
          displayedRestaurants.map((item: any, index: number) => (
            <TouchableOpacity
              key={String(item.id)}
              style={styles.restaurantCard}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: '/restaurant-details',
                  params: {
                    id: String(item.id),
                    name: item.tags.name,
                    amenity: item.tags.amenity || '',
                    cuisine: item.tags.cuisine || '',
                    street: item.tags['addr:street'] || '',
                  },
                })
              }
            >
              <Image
                source={{
                  uri: restaurantImages[
                    index % restaurantImages.length
                  ],
                }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />

              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>
                  {item.tags.name}
                </Text>

                {item.isDemo && (
                  <Text style={styles.demoLabel}>
                    Sample Restaurant
                  </Text>
                )}

                <Text style={styles.restaurantType}>
                  {item.tags.amenity === 'cafe'
                    ? 'Cafe'
                    : 'Restaurant'}
                </Text>

                <Text style={styles.restaurantPrice}>
                  Cuisine: {item.tags.cuisine || 'Not specified'}
                </Text>

                {item.tags['addr:street'] && (
                  <Text style={styles.restaurantPrice}>
                    Address: {item.tags['addr:street']}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Foodie
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  locationLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: 'bold',
  },

  location: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#222',
  },

  profile: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#FFE8E4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    fontSize: 23,
  },

  welcome: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitle: {
    color: '#777',
    fontSize: 15,
    marginTop: 5,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 22,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 52,
  },

  searchIcon: {
    fontSize: 19,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  banner: {
    backgroundColor: '#E94435',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bannerText: {
    flex: 1,
  },

  offer: {
    color: '#FFE1A8',
    fontWeight: 'bold',
    fontSize: 11,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 27,
    marginTop: 5,
  },

  bannerDescription: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
  },

  discount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 13,
  },

  bannerEmoji: {
    fontSize: 65,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    paddingHorizontal: 20,
    marginTop: 25,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#777',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 15,
  },

  categoriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  category: {
    alignItems: 'center',
    marginRight: 18,
  },

  categoryCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#FFF4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCategory: {
    backgroundColor: '#E94435',
  },

  categoryEmoji: {
    fontSize: 30,
  },

  categoryName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  selectedCategoryName: {
    color: '#E94435',
    fontWeight: 'bold',
  },

  noResults: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 15,
    paddingHorizontal: 20,
  },

  restaurantCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  restaurantImage: {
    width: '100%',
    height: 170,
  },

  restaurantInfo: {
    padding: 15,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  demoLabel: {
    color: '#E94435',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },

  restaurantType: {
    fontSize: 13,
    color: '#E94435',
    fontWeight: '600',
    marginTop: 4,
  },

  restaurantPrice: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  footerText: {
    color: '#999',
    fontSize: 13,
  },
});