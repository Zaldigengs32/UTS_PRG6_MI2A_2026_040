import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_URL = 'http://10.1.9.195:8080/api/farmapp';

const HARGA_PER_KG = { '1': 50000, '2': 35000, '3': 25000 };

function calcHarga(jenisHewan, beratHewan) {
  const berat = parseInt(beratHewan, 10);
  if (!berat || isNaN(berat)) return '';
  const rate = HARGA_PER_KG[jenisHewan];
  if (!rate) return '';
  return String(berat * rate);
}

export default function DetailScreen({ route, navigation }) {
  const { hewan } = route.params;
  const isAdd = !hewan?.idHewan;

  const [pemilikHewan, setPemilikHewan] = useState(hewan?.pemilikHewan || '');
  const [jenisHewan, setJenisHewan] = useState(hewan?.jenisHewan || '');
  const [kandangHewan, setKandangHewan] = useState(hewan?.kandangHewan || '');
  const [beratHewan, setBeratHewan] = useState(
    hewan?.beratHewan ? String(hewan.beratHewan) : ''
  );
  const [loading, setLoading] = useState(false);

  const hargaHewan = hewan?.hargaHewan
    ? String(hewan.hargaHewan)
    : calcHarga(jenisHewan, beratHewan);

  const handleCreate = async () => {
    if (!pemilikHewan.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Pemilik Hewan tidak boleh kosong.');
      } else {
        Alert.alert('Validasi', 'Pemilik Hewan tidak boleh kosong.');
      }
      return;
    }
    if (!['1', '2', '3'].includes(jenisHewan)) {
      if (Platform.OS === 'web') {
        window.alert('Jenis Hewan harus 1 (Sapi), 2 (Domba), atau 3 (Kambing).');
      } else {
        Alert.alert('Validasi', 'Jenis Hewan harus 1 (Sapi), 2 (Domba), atau 3 (Kambing).');
      }
      return;
    }
    const berat = parseInt(beratHewan, 10);
    if (!berat || berat <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Berat Hewan wajib diisi dan harus lebih dari 0.');
      } else {
        Alert.alert('Validasi', 'Berat Hewan wajib diisi dan harus lebih dari 0.');
      }
      return;
    }

    try {
      setLoading(true);
      await axios.post(API_URL, {
        pemilikHewan: pemilikHewan.trim(),
        jenisHewan,
        kandangHewan: kandangHewan.trim(),
        beratHewan: berat,
      });
      if (Platform.OS === 'web') {
        window.alert('Data berhasil ditambahkan.');
        navigation.goBack();
      } else {
        Alert.alert('Sukses', 'Data berhasil ditambahkan.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (Platform.OS === 'web') {
        window.alert('Gagal menambahkan data: ' + msg);
      } else {
        Alert.alert('Error', 'Gagal menambahkan data: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      Platform.OS === 'web'
        ? window.confirm(`Yakin ingin menghapus data milik "${pemilikHewan}"?`)
        : await new Promise((resolve) => {
            Alert.alert(
              'Konfirmasi Hapus',
              `Yakin ingin menghapus data milik "${pemilikHewan}"?`,
              [
                { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Hapus', style: 'destructive', onPress: () => resolve(true) },
              ]
            );
          });

    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${hewan.idHewan}`);
      if (Platform.OS === 'web') {
        window.alert('Data berhasil dihapus.');
        navigation.goBack();
      } else {
        Alert.alert('Sukses', 'Data berhasil dihapus.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (Platform.OS === 'web') {
        window.alert('Gagal menghapus data: ' + msg);
      } else {
        Alert.alert('Error', 'Gagal menghapus data: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Pemilik Hewan</Text>
      <TextInput
        style={styles.input}
        value={pemilikHewan}
        onChangeText={setPemilikHewan}
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Jenis Hewan</Text>
      <TextInput
        style={styles.input}
        value={jenisHewan}
        onChangeText={(text) => {
          if (text === '' || ['1', '2', '3'].includes(text)) {
            setJenisHewan(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={1}
        placeholder="1=Sapi  2=Domba  3=Kambing"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Kandang Hewan</Text>
      <TextInput
        style={styles.input}
        value={kandangHewan}
        onChangeText={setKandangHewan}
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Berat Hewan</Text>
      <TextInput
        style={styles.input}
        value={beratHewan}
        onChangeText={(text) => setBeratHewan(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Harga Hewan</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={hargaHewan}
        editable={false}
        placeholderTextColor="#bbb"
      />

      {loading && (
        <ActivityIndicator size="small" color="#999" style={{ marginVertical: 8 }} />
      )}
      {isAdd && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.btnText}>+ Add Data</Text>
        </TouchableOpacity>
      )}
      {!isAdd && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          disabled={loading}
        >
          <Text style={styles.btnTextDelete}>Delete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

DetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      hewan: PropTypes.shape({
        idHewan: PropTypes.number,
        pemilikHewan: PropTypes.string,
        jenisHewan: PropTypes.string,
        kandangHewan: PropTypes.string,
        beratHewan: PropTypes.number,
        hargaHewan: PropTypes.number,
      }),
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  inputDisabled: {
    backgroundColor: '#ebebeb',
    color: '#888',
  },
  addBtn: {
    marginTop: 28,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#CAEEFB',
  },
  deleteBtn: {
    marginTop: 28,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#c62828',
  },
  btnText: {
    color: '#1a6a8a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnTextDelete: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
