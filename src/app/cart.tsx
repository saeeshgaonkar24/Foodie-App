import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

import {
    addToCart,
    clearCart,
    getCartItems,
    removeFromCart,
    subscribeToCart,
} from '../services/cartService';

import { addOrder } from '../services/orderService';

export default function CartScreen() {
  const [items, setItems] = useState(getCartItems());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCart(() => {
      setItems(getCartItems());
    });

    return unsubscribe;
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items before placing an order.');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // Save order to Firebase Firestore
      await addOrder(items, total);

      Alert.alert(
        'Order Successful! 🎉',
        `Your order of ₹${total} has been placed successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.log('Order Error:', error);

      Alert.alert(
        'Order Failed',
        'Unable to place your order. Please check your internet connection and login status.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cart 🛒</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛍️</Text>

          <Text style={styles.emptyText}>
            Your cart is empty
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.emoji}>
                  {item.emoji}
                </Text>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>

                  <Text style={styles.price}>
                    ₹{item.price}
                  </Text>
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    <Text style={styles.quantityText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        emoji: item.emoji,
                      })
                    }
                    disabled={loading}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.totalAmount}>
                ₹{total}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={placeOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Place Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  emoji: {
    fontSize: 35,
    marginRight: 12,
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    backgroundColor: '#e23744',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },

  bottomContainer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 15,
    paddingBottom: 15,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e23744',
  },

  orderButton: {
    backgroundColor: '#e23744',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 65,
    marginBottom: 15,
  },

  emptyText: {
    fontSize: 20,
    marginBottom: 20,
  },

  shopButton: {
    backgroundColor: '#e23744',
    padding: 15,
    borderRadius: 10,
  },
});