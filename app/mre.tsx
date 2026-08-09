import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { runSimulation } from '../src/engine/eligibility';
import { SimulationInput, SimulationResult, PropertyType } from '../src/types';
import ResultCard from '../src/components/ResultCard';
import { Colors, PROPERTY_TYPES } from '../src/constants/theme';

export default function MREScreen() {
  const [price, setPrice] = useState('280000');
  const [rooms, setRooms] = useState('2');
  const [propertyType, setPropertyType] = useState<PropertyType>('maison');
  const [isOwner, setIsOwner] = useState(false);
  const [hasAid, setHasAid] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    const input: SimulationInput = {
      profile: 'mre',
      propertyType,
      priceTTC: parseInt(price.replace(/\s/g, '')) || 0,
      rooms: parseInt(rooms) || 0,
      isOwnerInMorocco: isOwner,
      hasReceivedStateAid: hasAid,
      isPrincipalResidence: isPrincipal,
    };
    setResult(runSimulation(input));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Simulateur MRE</Text>
      <Text style={styles.subtitle}>Marocain Résidant à l'Étranger</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ En tant que MRE, un compte bancaire marocain est obligatoire pour recevoir le virement de l'aide.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Type de bien</Text>
        <View style={styles.typeRow}>
          {PROPERTY_TYPES.filter(t => t.value !== 'terrain').map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeChip, propertyType === t.value && styles.typeChipActive]}
              onPress={() => setPropertyType(t.value as PropertyType)}
            >
              <Text style={[styles.typeChipText, propertyType === t.value && styles.typeChipTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Prix d'achat TTC (DH)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Ex: 280000" placeholderTextColor={Colors.textMuted} />

        <Text style={styles.label}>Nombre de pièces</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={rooms} onChangeText={setRooms} placeholder="Minimum 2" placeholderTextColor={Colors.textMuted} />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Déjà propriétaire au Maroc ?</Text>
          <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ false: '#D1D5DB', true: Colors.primary }} thumbColor="#fff" />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Déjà bénéficié d'aide de l'État ?</Text>
          <Switch value={hasAid} onValueChange={setHasAid} trackColor={{ false: '#D1D5DB', true: Colors.primary }} thumbColor="#fff" />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Engagement résidence principale 5 ans ?</Text>
          <Switch value={isPrincipal} onValueChange={setIsPrincipal} trackColor={{ false: '#D1D5DB', true: Colors.secondary }} thumbColor="#fff" />
        </View>

        <TouchableOpacity style={styles.button} onPress={simulate} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Simuler mon éligibilité</Text>
        </TouchableOpacity>
      </View>

      {result && <ResultCard result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 14 },
  infoBox: { backgroundColor: Colors.infoBg, padding: 14, borderRadius: 12, marginBottom: 14 },
  infoText: { color: Colors.primary, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: Colors.card, borderRadius: 14, padding: 18, elevation: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textLight, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: Colors.border },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipText: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  typeChipTextActive: { color: '#fff', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8, color: Colors.text },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA', color: Colors.text },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, gap: 12 },
  switchLabel: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 14, marginTop: 26, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
