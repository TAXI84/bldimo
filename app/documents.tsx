import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Colors } from '../src/constants/theme';

const DOCUMENTS_DAAM = [
  'Formulaire de demande Daam Sakane (signé et légalisé)',
  'Déclaration sur l\'honneur (signée et légalisée)',
  'Copie de la CIN / Passeport',
  'Attestation de non-propriété (Conservation foncière)',
  'Copie du compromis de vente (notarié)',
  'Copie du permis d\'habiter (≥ 01/01/2023)',
  'Justificatif de revenus (3 derniers mois)',
  'Engagement de résidence principale (5 ans)',
];

const DOCUMENTS_ACHAT = [
  'Promesse de vente ou compromis',
  'Contrat de vente définitif',
  'Acte notarié',
  'Quittance de paiement',
  'Attestation de déblocage des fonds (CDG)',
];

const DOCUMENTS_MRE = ['Attestation de compte bancaire marocain'];
const DOCUMENTS_ETRANGER = ['Titre de séjour en cours de validité'];

export default function DocumentsScreen() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (doc: string) => {
    setChecked(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  const renderList = (title: string, docs: string[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {docs.map((doc, i) => (
        <TouchableOpacity key={i} style={styles.docRow} onPress={() => toggle(doc)} activeOpacity={0.7}>
          <View style={[styles.checkbox, checked[doc] && styles.checkboxChecked]}>
            {checked[doc] && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={[styles.docText, checked[doc] && styles.docChecked]}>{doc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
      <Text style={styles.title}>Documents & Checklist</Text>
      <Text style={styles.subtitle}>Cochez les documents déjà préparés</Text>

      {renderList('Demande d\'aide Daam Sakane', DOCUMENTS_DAAM)}
      {renderList('Spécifique MRE', DOCUMENTS_MRE)}
      {renderList('Spécifique Étranger résident', DOCUMENTS_ETRANGER)}
      {renderList('Documents Achat-Vente', DOCUMENTS_ACHAT)}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Sources officielles</Text>
        <Text style={styles.link}>• www.daamsakane.ma</Text>
        <Text style={styles.link}>• www.mhpv.gov.ma</Text>
        <Text style={styles.link}>• www.cdg.ma</Text>
        <Text style={styles.link}>• www.finances.gov.ma</Text>
      </View>

      <Text style={styles.note}>
        Checklist indicative. Vérifiez toujours les exigences à jour sur daamsakane.ma
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 18 },
  section: { 
    backgroundColor: Colors.card, 
    borderRadius: 14, 
    padding: 16, 
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  accentBar: { width: 4, height: 16, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  docRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { 
    width: 24, height: 24, borderWidth: 2, borderColor: Colors.primary, 
    borderRadius: 6, marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  check: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  docText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  docChecked: { textDecorationLine: 'line-through', color: Colors.textMuted },
  infoBox: { 
    backgroundColor: Colors.infoBg, padding: 16, borderRadius: 14, marginTop: 6,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  infoTitle: { fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  link: { color: Colors.primary, fontSize: 13, marginBottom: 3 },
  note: { fontSize: 12, color: Colors.textMuted, marginTop: 18, fontStyle: 'italic', textAlign: 'center', lineHeight: 18 },
});
