import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;

      if (user) {
        setEmail(user.email || '');

        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          setName(userDoc.data().name);
        }
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setName('');
      setEmail('');
      Alert.alert('Success', 'Logged out successfully');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {auth.currentUser ? (
        <>
          <Text style={styles.name}>Welcome, {name || 'User'}!</Text>
          <Text style={styles.email}>{email}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Welcome to Foodie!</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerText}>Create New Account</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e23744',
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginVertical: 15,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 25,
  },
  button: {
    backgroundColor: '#e23744',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#e23744',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerText: {
    color: '#e23744',
    fontSize: 18,
    fontWeight: 'bold',
  },
});