import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { runSimulation } from '../src/engine/eligibility';
import { SimulationInput, SimulationResult, ProfileType } from '../src/types';
import ResultCard from '../src/components/ResultCard';
import { Colors } from '../src/constants/theme';

export default function EtrangerScreen() {
  const [isResident, setIsResident] = useState(true);
  const [price, setPrice] = useState('250000');
  const [rooms, setRooms] = useState('2');
  const [income, setIncome] = useState('15000');
  const [isOwner, setIsOwner] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    const profile: ProfileType = isResident ? 'etranger_resident' : 'etranger_investisseur';
    const input: SimulationInput = {
      profile,
      propertyType: 'appartement',
      priceTTC: parseInt(price.replace(/\s/g, '')) || 0,
      rooms: parseInt(rooms) || 0,
      monthlyIncome: parseInt(income.replace(/\s/g, '')) || 0,
      isOwnerInMorocco: isOwner,
      hasReceivedStateAid: false,
      isPrincipalResidence: isPrincipal,
    };
    setResult(runSimulation(input));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.title}>Simulateur Étranger</Text>
      <Text style={styles.subtitle}>Résident ou Investisseur</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.switchLabel}>Je suis résident au Maroc (titre de séjour)</Text>
          <Switch value={isResident} onValueChange={setIsResident} trackColor={{ false: '#ccc', true: Colors.primary }} />
        </View>
        <Text style={styles.profileHint}>
          {isResident ? '→ Profil : Étranger résident' : '→ Profil : Investisseur non-résident'}
        </Text>

        <Text style={styles.label}>Prix d'achat TTC (DH)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Ex: 250000" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Nombre de pièces</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={rooms} onChangeText={setRooms} placeholder="Minimum 2" placeholderTextColor="#aaa" />

        {isResident && (
          <>
            <Text style={styles.label}>Revenu mensuel net (DH)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={income} onChangeText={setIncome} placeholder="Ex: 15000" placeholderTextColor="#aaa" />
          </>
        )}

        <View style={styles.row}>
          <Text style={styles.switchLabel}>Déjà propriétaire au Maroc ?</Text>
          <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ false: '#ccc', true: Colors.primary }} />
        </View>

        <View style={styles.row}>
          <Text style={styles.switchLabel}>Objectif : résidence principale ?</Text>
          <Switch value={isPrincipal} onValueChange={setIsPrincipal} trackColor={{ false: '#ccc', true: Colors.secondary }} />
        </View>

        <TouchableOpacity style={styles.button} onPress={simulate} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Simuler mon profil</Text>
        </TouchableOpacity>
      </View>

      {result && <ResultCard result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 16 },
  card: { backgroundColor: Colors.card, borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 14, marginBottom: 6, color: Colors.text },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 12 },
  switchLabel: { flex: 1, fontSize: 14, color: Colors.text },
  profileHint: { fontSize: 13, color: Colors.primary, marginTop: 6, marginBottom: 4, fontWeight: '500' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
