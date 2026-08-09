import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { runSimulation } from '../src/engine/eligibility';
import { SimulationInput, SimulationResult, ProfileType, PropertyType } from '../src/types';
import ResultCard from '../src/components/ResultCard';
import { Colors, PROPERTY_TYPES } from '../src/constants/theme';

export default function EtrangerScreen() {
  const [isResident, setIsResident] = useState(true);
  const [price, setPrice] = useState('250000');
  const [rooms, setRooms] = useState('2');
  const [income, setIncome] = useState('15000');
  const [propertyType, setPropertyType] = useState<PropertyType>('appartement');
  const [isOwner, setIsOwner] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    const profile: ProfileType = isResident ? 'etranger_resident' : 'etranger_investisseur';
    const input: SimulationInput = {
      profile,
      propertyType,
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Simulateur Étranger</Text>
      <Text style={styles.subtitle}>Résident ou Investisseur</Text>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Je suis résident au Maroc (titre de séjour)</Text>
          <Switch value={isResident} onValueChange={setIsResident} trackColor={{ false: '#D1D5DB', true: Colors.primary }} thumbColor="#fff" />
        </View>
        <Text style={styles.profileHint}>
          {isResident ? '→ Profil : Étranger résident' : '→ Profil : Investisseur non-résident'}
        </Text>

        <Text style={styles.sectionLabel}>Type de bien</Text>
        <View style={styles.typeRow}>
          {PROPERTY_TYPES.filter(t => t.value !== 'terrain').map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeChip, propertyType === t.value && styles.typeChipActive]}
              onPress={() => setPropertyType(t.value as PropertyType)}
            >
              <Text style={[styles.typeChipText, propertyType === t.value && styles.typeChipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Prix d'achat TTC (DH)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Ex: 250000" placeholderTextColor={Colors.textMuted} />

        <Text style={styles.label}>Nombre de pièces</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={rooms} onChangeText={setRooms} placeholder="Minimum 2" placeholderTextColor={Colors.textMuted} />

        {isResident && (
          <>
            <Text style={styles.label}>Revenu mensuel net (DH)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={income} onChangeText={setIncome} placeholder="Ex: 15000" placeholderTextColor={Colors.textMuted} />
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Déjà propriétaire au Maroc ?</Text>
          <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ false: '#D1D5DB', true: Colors.primary }} thumbColor="#fff" />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Objectif : résidence principale ?</Text>
          <Switch value={isPrincipal} onValueChange={setIsPrincipal} trackColor={{ false: '#D1D5DB', true: Colors.secondary }} thumbColor="#fff" />
        </View>

        <TouchableOpacity style={styles.button} onPress={simulate} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Simuler mon profil</Text>
        </TouchableOpacity>
      </View>

      {result && <ResultCard result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 16 },
  card: { backgroundColor: Colors.card, borderRadius: 14, padding: 18, elevation: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textLight, marginTop: 14, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: Colors.border },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipText: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  typeChipTextActive: { color: '#fff', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8, color: Colors.text },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA', color: Colors.text },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, gap: 12 },
  switchLabel: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  profileHint: { fontSize: 13, color: Colors.primary, marginTop: 6, marginBottom: 4, fontWeight: '600' },
  button: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 14, marginTop: 26, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
