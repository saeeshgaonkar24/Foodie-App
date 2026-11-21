import { useEffect, useState } from 'react';

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import {
    addToCart,
    getCartItems,
    removeFromCart,
    subscribeToCart,
} from '../services/cartService';

const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
];

const menuItems = [
  { id: 1, name: 'Veg Burger', price: 120, emoji: '🍔' },
  { id: 2, name: 'Cheese Pizza', price: 199, emoji: '🍕' },
  { id: 3, name: 'Chicken Biryani', price: 220, emoji: '🍛' },
  { id: 4, name: 'French Fries', price: 99, emoji: '🍟' },
  { id: 5, name: 'Cold Coffee', price: 89, emoji: '🥤' },
  { id: 6, name: 'Chocolate Cake', price: 150, emoji: '🍰' },
];

export default function RestaurantDetails() {
  const params = useLocalSearchParams();

  const [cartItems, setCartItems] = useState(getCartItems());

  const restaurantName = params.name || 'Restaurant';

  const imageIndex =
    Math.abs(Number(params.id) || 0) % restaurantImages.length;

  // Listen for cart changes
  useEffect(() => {
    const unsubscribe = subscribeToCart(() => {
      setCartItems(getCartItems());
    });

    return unsubscribe;
  }, []);

  // Add food to cart
  const addItem = (id: number) => {
    const item = menuItems.find(item => item.id === id);

    if (item) {
      addToCart(item);
    }
  };

  // Remove food from cart
  const removeItem = (id: number) => {
    removeFromCart(id);
  };

  // Calculate total quantity
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Image
          source={{ uri: restaurantImages[imageIndex] }}
          style={styles.restaurantImage}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.restaurantName}>
            {restaurantName}
          </Text>

          <Text style={styles.restaurantType}>
            {params.amenity === 'cafe' ? 'Cafe' : 'Restaurant'}
          </Text>

          <Text style={styles.detail}>
            Cuisine: {params.cuisine || 'Not specified'}
          </Text>

          <Text style={styles.detail}>
            Address: {params.street || 'Panjim, Goa'}
          </Text>
        </View>

        <Text style={styles.menuTitle}>Food Menu</Text>

        {menuItems.map(item => {
          const quantity =
            cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;

          return (
            <View style={styles.menuCard} key={item.id}>
              <View style={styles.menuInfo}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>

                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
              </View>

              <View style={styles.quantityBox}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.quantityText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => addItem(item.id)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

      </ScrollView>

      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartItems}>
              {totalItems} items added
            </Text>

            <Text style={styles.cartPrice}>
              Total: ₹{totalPrice}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.8}
            onPress={() => router.push('/cart')}
          >
            <Text style={styles.cartButtonText}>
              View Cart →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  restaurantImage: {
    width: '100%',
    height: 230,
  },

  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },

  backText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  info: {
    padding: 20,
  },

  restaurantName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
  },

  restaurantType: {
    color: '#E94435',
    fontSize: 15,
    marginTop: 6,
  },

  detail: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },

  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  menuCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuEmoji: {
    fontSize: 35,
    marginRight: 12,
  },

  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  price: {
    color: '#666',
    marginTop: 5,
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    backgroundColor: '#E94435',
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

  cartBar: {
    backgroundColor: '#E94435',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cartItems: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  cartPrice: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 4,
  },

  cartButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },

  cartButtonText: {
    color: '#E94435',
    fontWeight: 'bold',
  },
});