import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const USERS = [
  { username: '0320240040', password: '1004062006' },
];

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const found = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!found) {
      if (Platform.OS === 'web') {
        window.alert('Username atau password salah.');
      } else {
        Alert.alert('Login Gagal', 'Username atau password salah.');
      }
      return;
    }
    try {
      await AsyncStorage.setItem('loggedUser', found.username);
      navigation.replace('Dashboard', { username: found.username });
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan sesi: ' + e.message);
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.appTitle}>Farm Apps_040</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none" 
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: '#CAEEFB',
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#1a6a8a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  clearBtnText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
  },
});