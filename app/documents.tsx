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
      <Text style={styles.sectionTitle}>{title}</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.title}>Documents & Checklist</Text>
      <Text style={styles.subtitle}>Cochez les documents que vous avez déjà préparés</Text>

      {renderList('Pour la demande d\'aide Daam Sakane', DOCUMENTS_DAAM)}
      {renderList('Spécifique MRE', DOCUMENTS_MRE)}
      {renderList('Spécifique Étranger résident', DOCUMENTS_ETRANGER)}
      {renderList('Documents Achat-Vente (toujours nécessaires)', DOCUMENTS_ACHAT)}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Sources officielles</Text>
        <Text style={styles.link}>• www.daamsakane.ma</Text>
        <Text style={styles.link}>• www.mhpv.gov.ma</Text>
        <Text style={styles.link}>• www.cdg.ma</Text>
        <Text style={styles.link}>• www.finances.gov.ma</Text>
      </View>

      <Text style={styles.note}>
        Cette checklist est indicative. Vérifiez toujours les exigences à jour sur la plateforme officielle Daam Sakane.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 16 },
  section: { backgroundColor: Colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  docRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: Colors.primary, borderRadius: 6, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary },
  check: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  docText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  docChecked: { textDecorationLine: 'line-through', color: '#999' },
  infoBox: { backgroundColor: Colors.infoBg, padding: 16, borderRadius: 12, marginTop: 8 },
  infoTitle: { fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  link: { color: Colors.primary, fontSize: 13, marginBottom: 3 },
  note: { fontSize: 12, color: '#888', marginTop: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 18 },
});
