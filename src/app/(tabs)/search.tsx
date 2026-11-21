import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { getRestaurants } from '../../services/restaurantApi';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const restaurantImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600',
  ];

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.log('Search API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((item) => {
    const name = item.tags?.name || '';
    const cuisine = item.tags?.cuisine || '';

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      cuisine.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openRestaurant = (item: any) => {
    router.push({
      pathname: '/restaurant-details',
      params: {
        id: String(item.id),
        name: item.tags?.name || 'Restaurant',
        amenity: item.tags?.amenity || '',
        cuisine: item.tags?.cuisine || '',
        street: item.tags?.['addr:street'] || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Food 🍕</Text>

      <TextInput
        placeholder="Search restaurants or cuisine..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.subtitle}>
        {search ? 'Search Results' : 'Discover Restaurants'}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e23744"
          style={{ marginTop: 30 }}
        />
      ) : filteredRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>

          <Text style={styles.emptyText}>
            No restaurants found
          </Text>

          <Text style={styles.emptySubtext}>
            Try searching with another name or cuisine.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const imageIndex =
              Math.abs(Number(item.id) || 0) % restaurantImages.length;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => openRestaurant(item)}
              >
                <Image
                  source={{ uri: restaurantImages[imageIndex] }}
                  style={styles.image}
                />

                <View style={styles.details}>
                  <Text style={styles.restaurantName}>
                    {item.tags?.name || 'Restaurant'}
                  </Text>

                  <Text style={styles.cuisine}>
                    {item.tags?.cuisine || 'Food and Dining'}
                  </Text>

                  <Text style={styles.location}>
                    📍 {item.tags?.['addr:street'] || 'Panjim, Goa'}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },

  search: {
    backgroundColor: '#F3F3F3',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    fontSize: 15,
  },

  subtitle: {
    marginTop: 25,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },

  image: {
    width: 85,
    height: 85,
    borderRadius: 10,
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  cuisine: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },

  location: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  arrow: {
    fontSize: 28,
    color: '#e23744',
    paddingHorizontal: 5,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 70,
  },

  emptyEmoji: {
    fontSize: 50,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
});