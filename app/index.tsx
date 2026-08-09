import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { runSimulation } from '../src/engine/eligibility';
import { SimulationInput, SimulationResult, PropertyType } from '../src/types';
import ResultCard from '../src/components/ResultCard';
import AdBanner from '../src/components/AdBanner';
import { Colors, PROPERTY_TYPES } from '../src/constants/theme';

export default function MarocainScreen() {
  const [price, setPrice] = useState('250000');
  const [rooms, setRooms] = useState('2');
  const [propertyType, setPropertyType] = useState<PropertyType>('appartement');
  const [isOwner, setIsOwner] = useState(false);
  const [hasAid, setHasAid] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    const input: SimulationInput = {
      profile: 'marocain',
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <View style={styles.titleRow}>
        <Text style={styles.flag}>🇲🇦</Text>
        <View>
          <Text style={styles.title}>Simulateur Marocain</Text>
          <Text style={styles.subtitle}>Daam Sakane • Aide au logement</Text>
        </View>
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
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Ex: 250000" placeholderTextColor={Colors.textMuted} />

        <Text style={styles.label}>Nombre de pièces</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={rooms} onChangeText={setRooms} placeholder="Minimum 2" placeholderTextColor={Colors.textMuted} />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Déjà propriétaire d'un logement au Maroc ?</Text>
          <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ false: '#D1D5DB', true: Colors.primary }} thumbColor="#fff" />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Déjà bénéficié d'une aide de l'État ?</Text>
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

      <AdBanner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  flag: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  card: { 
    backgroundColor: Colors.card, 
    borderRadius: 14, 
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    elevation: 2,
  },
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
