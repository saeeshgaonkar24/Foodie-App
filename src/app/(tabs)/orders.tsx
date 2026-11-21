import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFocusEffect } from 'expo-router';

import {
  getOrders,
  Order,
  updateOrderStatus,
} from '../../services/orderService';

const stages = [
  'Order Placed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadOrders = async () => {
        try {
          const savedOrders = await getOrders();

          if (active) {
            setOrders(savedOrders);
          }
        } catch (error) {
          console.log('Load Orders Error:', error);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadOrders();

      return () => {
        active = false;
      };
    }, [])
  );

  const moveToNextStage = async (order: Order) => {
    const currentIndex = stages.indexOf(order.status);

    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      return;
    }

    const nextStatus = stages[currentIndex + 1];

    setUpdatingOrderId(order.id);

    try {
      await updateOrderStatus(order.id, nextStatus);

      setOrders(previousOrders =>
        previousOrders.map(item =>
          item.id === order.id
            ? { ...item, status: nextStatus }
            : item
        )
      );

      Alert.alert('Status Updated', `Order is now ${nextStatus}`);
    } catch (error) {
      console.log('Status Update Error:', error);
      Alert.alert('Error', 'Unable to update order status.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders 📦</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e23744" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your placed orders will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map(order => {
            const currentIndex = stages.indexOf(order.status);

            return (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.orderTitle}>
                  Order #{order.id.slice(-6)}
                </Text>

                <Text style={styles.date}>{order.date}</Text>

                {order.items.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.emoji} {item.name} x {item.quantity}
                    </Text>

                    <Text style={styles.itemPrice}>
                      ₹{item.price * item.quantity}
                    </Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>
                    ₹{order.total}
                  </Text>
                </View>

                <Text style={styles.trackingHeading}>
                  Track Your Order 🚚
                </Text>

                {stages.map((stage, index) => (
                  <View key={stage} style={styles.stageRow}>
                    <View
                      style={[
                        styles.circle,
                        index <= currentIndex && styles.activeCircle,
                      ]}
                    >
                      <Text style={styles.circleText}>
                        {index <= currentIndex ? '✓' : ''}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.stageText,
                        index <= currentIndex && styles.activeStageText,
                      ]}
                    >
                      {stage}
                    </Text>
                  </View>
                ))}

                {currentIndex < stages.length - 1 && currentIndex >= 0 && (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => moveToNextStage(order)}
                    disabled={updatingOrderId === order.id}
                  >
                    <Text style={styles.updateButtonText}>
                      {updatingOrderId === order.id
                        ? 'Updating...'
                        : 'Move to Next Stage'}
                    </Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Delivered' && (
                  <Text style={styles.deliveredText}>
                    🎉 Your order has been delivered!
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 65,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
  },

  emptyText: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
  },

  orderCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },

  orderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  date: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 15,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  itemName: {
    fontSize: 14,
    flex: 1,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  totalRow: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e23744',
  },

  trackingHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 15,
  },

  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  circle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  activeCircle: {
    backgroundColor: 'green',
    borderColor: 'green',
  },

  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  stageText: {
    fontSize: 14,
    color: '#888',
  },

  activeStageText: {
    color: 'green',
    fontWeight: 'bold',
  },

  updateButton: {
    backgroundColor: '#e23744',
    padding: 13,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 12,
  },

  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  deliveredText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
});