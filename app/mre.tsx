import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { runSimulation } from '../src/engine/eligibility';
import { SimulationInput, SimulationResult } from '../src/types';
import ResultCard from '../src/components/ResultCard';
import { Colors } from '../src/constants/theme';

export default function MREScreen() {
  const [price, setPrice] = useState('280000');
  const [rooms, setRooms] = useState('2');
  const [isOwner, setIsOwner] = useState(false);
  const [hasAid, setHasAid] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    const input: SimulationInput = {
      profile: 'mre',
      propertyType: 'maison',
      priceTTC: parseInt(price.replace(/\s/g, '')) || 0,
      rooms: parseInt(rooms) || 0,
      isOwnerInMorocco: isOwner,
      hasReceivedStateAid: hasAid,
      isPrincipalResidence: isPrincipal,
    };
    setResult(runSimulation(input));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.title}>Simulateur MRE</Text>
      <Text style={styles.subtitle}>Marocain Résidant à l'Étranger</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ En tant que MRE, vous devez justifier d'un compte bancaire marocain pour recevoir le virement de l'aide.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Prix d'achat TTC (DH)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Ex: 280000" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Nombre de pièces</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={rooms} onChangeText={setRooms} placeholder="Minimum 2" placeholderTextColor="#aaa" />

        <View style={styles.row}>
          <Text style={styles.switchLabel}>Déjà propriétaire au Maroc ?</Text>
          <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ false: '#ccc', true: Colors.primary }} />
        </View>

        <View style={styles.row}>
          <Text style={styles.switchLabel}>Déjà bénéficié d'aide de l'État ?</Text>
          <Switch value={hasAid} onValueChange={setHasAid} trackColor={{ false: '#ccc', true: Colors.primary }} />
        </View>

        <View style={styles.row}>
          <Text style={styles.switchLabel}>Engagement résidence principale 5 ans ?</Text>
          <Switch value={isPrincipal} onValueChange={setIsPrincipal} trackColor={{ false: '#ccc', true: Colors.secondary }} />
        </View>

        <TouchableOpacity style={styles.button} onPress={simulate} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Simuler mon éligibilité</Text>
        </TouchableOpacity>
      </View>

      {result && <ResultCard result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 12 },
  infoBox: { backgroundColor: Colors.infoBg, padding: 14, borderRadius: 10, marginBottom: 14 },
  infoText: { color: Colors.primary, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: Colors.card, borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 14, marginBottom: 6, color: Colors.text },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 12 },
  switchLabel: { flex: 1, fontSize: 14, color: Colors.text },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
