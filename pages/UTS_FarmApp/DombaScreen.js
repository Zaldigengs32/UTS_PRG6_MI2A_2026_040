import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = 'http://10.1.9.195:8080/api/farmapp/jenis/2';

export default function DombaScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const sorted = (res.data.data || []).sort((a, b) =>
        (a.kandangHewan || '').localeCompare(b.kandangHewan || '')
      );
      setData(sorted);
    } catch (err) {
      if (err.response?.status === 404) {
        setData([]);
      } else {
        Alert.alert('Error', 'Gagal mengambil data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('Detail', { hewan: item })}
      activeOpacity={0.7}
    >
      <Text style={styles.rowNumber}>{index + 1}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{item.pemilikHewan}</Text>
        <Text style={styles.rowSub}>{item.kandangHewan}</Text>
        <Text style={styles.rowPrice}>
          Rp {(item.hargaHewan || 0).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.idHewan)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada data Domba.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

DombaScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 32,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  listContent: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ebebeb',
  },
  rowNumber: {
    width: 24,
    fontSize: 15,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 2,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 8,
  },
  rowName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  rowSub: {
    fontSize: 12,
    color: '#777',
    marginTop: 1,
  },
  rowPrice: {
    fontSize: 12,
    color: '#444',
    marginTop: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 15,
  },
});