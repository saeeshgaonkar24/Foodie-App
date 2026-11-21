export type CartItem = {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
};

let cartItems: CartItem[] = [];

const listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const getCartItems = () => {
  return [...cartItems];
};

export const subscribeToCart = (listener: () => void) => {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

export const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  const existingItem = cartItems.find(
    cartItem => cartItem.id === item.id
  );

  if (existingItem) {
    cartItems = cartItems.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  } else {
    cartItems = [...cartItems, { ...item, quantity: 1 }];
  }

  notifyListeners();
};

export const removeFromCart = (id: number) => {
  const existingItem = cartItems.find(
    item => item.id === id
  );

  if (!existingItem) return;

  if (existingItem.quantity > 1) {
    cartItems = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
  } else {
    cartItems = cartItems.filter(item => item.id !== id);
  }

  notifyListeners();
};

export const clearCart = () => {
  cartItems = [];
  notifyListeners();
};