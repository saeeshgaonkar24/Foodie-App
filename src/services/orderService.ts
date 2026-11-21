import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';

import { auth, db } from './firebase';

import { CartItem } from './cartService';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  createdAt?: number;
};

export const addOrder = async (
  items: CartItem[],
  total: number
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Please login before placing an order.');
  }

  const newOrder = {
    userId: user.uid,
    items,
    total,
    date: new Date().toLocaleString(),
    createdAt: Date.now(),
    status: 'Order Placed',
  };

  await addDoc(collection(db, 'orders'), newOrder);
};

export const getOrders = async (): Promise<Order[]> => {
  const user = auth.currentUser;

  if (!user) {
    return [];
  }

  const ordersQuery = query(
    collection(db, 'orders'),
    where('userId', '==', user.uid)
  );

  const snapshot = await getDocs(ordersQuery);

  const orders = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Order[];

  return orders.sort((a, b) => {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  newStatus: string
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Please login first.');
  }

  const orderRef = doc(db, 'orders', orderId);

  await updateDoc(orderRef, {
    status: newStatus,
  });
};