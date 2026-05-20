import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'http://10.1.9.195:8080/api/farmapp';
const JENIS = { '1': 'Sapi', '2': 'Domba', '3': 'Kambing' };
const FEATURES = ['Sapi', 'Domba', 'Kambing'];

export default function DashboardScreen({ navigation, route }) {
  const username = route?.params?.username || 'User';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setData(res.data.data || []);
      } catch (err) {
        Alert.alert('Error', 'Gagal mengambil data: ' + err.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const totalHarga = data.reduce((sum, h) => sum + (h.hargaHewan || 0), 0);
  const maxHarga = data.length ? Math.max(...data.map((h) => h.hargaHewan || 0)) : 0;
  const countByJenis = data.reduce((acc, h) => ({ ...acc, [h.jenisHewan]: (acc[h.jenisHewan] || 0) + 1 }), {});
  const topJenis = Object.entries(countByJenis).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: 'Total Hewan', value: `${data.length} Ekor`, bg: '#51A9FF' },
    { label: 'Total Assets', value: `Rp ${totalHarga.toLocaleString()}`, bg: '#FE9276' },
    { label: 'Jenis Terbanyak', value: topJenis ? JENIS[topJenis[0]] || '-' : '-', bg: '#FE9276' },
    { label: 'Harga Tertinggi', value: `Rp ${maxHarga.toLocaleString()}`, bg: '#51A9FF' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farm Apps_040</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsColumn}>
            {stats.map((s, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Feature</Text>
        <View style={styles.featureRow}>
          {FEATURES.map((f) => (
            <TouchableOpacity key={f} style={styles.btn} onPress={() => navigation.navigate(f)}>
              <Text style={styles.btnText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Form Data</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Detail', { hewan: null })}>
          <Text style={styles.btnText}>+ Add Data</Text>
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Welcome {username} !</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222' },
  scroll: { 
    padding: 16, 
    paddingBottom: 32 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#222', 
    marginTop: 16, 
    marginBottom: 8 },
  statsColumn: { 
    gap: 10 },
  statCard: { 
    borderRadius: 10, 
    paddingVertical: 16, 
    paddingHorizontal: 20 },
  statValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff' },
  statLabel: { 
    fontSize: 12, 
    color: '#fff', 
    marginTop: 2, 
    opacity: 0.85 },
  featureRow: { 
    flexDirection: 'row', 
    gap: 10 },
  btn: { 
    flex: 1, 
    backgroundColor: '#CAEEFB', 
    borderRadius: 8, 
    paddingVertical: 13, 
    alignItems: 'center' },
  btnText: { 
    fontSize: 14, 
    color: '#1a6a8a', 
    fontWeight: 'bold' },
  welcomeText: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 14, 
    color: '#555' },
});
