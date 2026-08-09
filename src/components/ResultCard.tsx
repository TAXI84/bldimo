import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SimulationResult } from '../types';
import { Colors } from '../constants/theme';

interface Props {
  result: SimulationResult;
}

const PERSONAL_DOCS = [
  'cin', 'passeport', 'titre de séjour', 'photo', 'justificatif de revenus',
  'bulletins de salaire', 'attestation de travail', 'compte bancaire'
];

function isPersonalDoc(doc: string): boolean {
  const lower = doc.toLowerCase();
  return PERSONAL_DOCS.some(k => lower.includes(k));
}

function getDocExampleHint(doc: string): string {
  const lower = doc.toLowerCase();
  if (lower.includes('passeport')) return 'Exemple : 1ères pages du passeport marocain (identité + validité)';
  if (lower.includes('cin')) return 'Exemple : recto + verso de la CIN marocaine';
  if (lower.includes('titre de séjour')) return 'Exemple : titre de séjour en cours de validité';
  if (lower.includes('revenus') || lower.includes('salaire')) return 'Exemple : 3 derniers bulletins de salaire ou attestation';
  if (lower.includes('compte bancaire')) return 'Exemple : relevé ou attestation de compte bancaire marocain';
  if (lower.includes('non-propriété')) return 'Exemple : attestation de non-propriété (Conservation foncière)';
  return 'Document personnel à fournir (voir modèle type)';
}

export default function ResultCard({ result }: Props) {
  const onDownload = (doc: string) => {
    Alert.alert(
      'Téléchargement',
      `« ${doc} »\n\nLe formulaire officiel sera disponible au téléchargement (PDF). Pour l’instant, rendez-vous sur la plateforme officielle Daam Sakan / banque partenaire.`,
      [{ text: 'OK' }]
    );
  };

  const onPreview = (doc: string) => {
    Alert.alert('Aperçu du document', getDocExampleHint(doc), [{ text: 'Compris' }]);
  };

  return (
    <View style={styles.card}>
      <View style={[
        styles.summaryBox,
        result.isEligibleForAny ? styles.summarySuccess : styles.summaryNeutral
      ]}>
        <Text style={styles.summary}>{result.summary}</Text>
      </View>

      {result.devices.map((device, idx) => (
        <View key={device.id || idx} style={styles.deviceBox}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>{device.shortName || device.name}</Text>
            <View style={[styles.badge, device.eligible ? styles.badgeSuccess : styles.badgeDanger]}>
              <Text style={styles.badgeText}>{device.eligible ? 'ÉLIGIBLE' : 'NON ÉLIGIBLE'}</Text>
            </View>
          </View>
          <Text style={styles.deviceFullName}>{device.name}</Text>

          {device.amount != null && (
            <Text style={styles.amount}>{device.amount.toLocaleString('fr-MA')} DH</Text>
          )}

          {device.advantages.length > 0 && (
            <View style={styles.list}>
              {device.advantages.map((a, i) => (
                <Text key={i} style={styles.advantage}>✓ {a}</Text>
              ))}
            </View>
          )}

          {device.refusalReasons.length > 0 && (
            <View style={styles.list}>
              {device.refusalReasons.map((r, i) => (
                <Text key={i} style={styles.refusal}>• {r}</Text>
              ))}
            </View>
          )}
        </View>
      ))}

      {result.documents && result.documents.length > 0 && (
        <View style={styles.docsBox}>
          <Text style={styles.docsTitle}>Documents à préparer</Text>
          <Text style={styles.docsHint}>
            📥 = télécharger le formulaire · 👁 = voir un exemple
          </Text>
          {result.documents.map((doc, i) => {
            const personal = isPersonalDoc(doc);
            return (
              <View key={i} style={styles.docRow}>
                <Text style={styles.docItem} numberOfLines={2}>• {doc}</Text>
                <View style={styles.docActions}>
                  {personal ? (
                    <TouchableOpacity onPress={() => onPreview(doc)} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="eye-outline" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => onDownload(doc)} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="download-outline" size={22} color={Colors.secondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {result.notaryFees > 0 && (
        <View style={styles.infoBox}>
          <Text style={styles.info}>
            ℹ️ Frais de notaire plafonnés pour les logements ≤ 700 000 DH
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderTopWidth: 3,
    borderTopColor: Colors.secondary,
    elevation: 3,
  },
  summaryBox: { padding: 14, borderRadius: 12, marginBottom: 14 },
  summarySuccess: { backgroundColor: Colors.successBg },
  summaryNeutral: { backgroundColor: Colors.infoBg },
  summary: { fontSize: 15, fontWeight: '700', color: Colors.text, lineHeight: 22 },
  deviceBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  deviceName: { fontWeight: '800', fontSize: 15, color: Colors.primary, flex: 1 },
  deviceFullName: { fontSize: 12, color: Colors.textLight, marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeSuccess: { backgroundColor: Colors.secondary },
  badgeDanger: { backgroundColor: Colors.danger },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  amount: { fontSize: 26, fontWeight: '800', color: Colors.secondary, marginVertical: 6 },
  list: { marginTop: 4 },
  advantage: { color: Colors.secondaryDark, fontSize: 13, lineHeight: 20, marginBottom: 2 },
  refusal: { color: Colors.danger, fontSize: 13, lineHeight: 20, marginBottom: 2 },
  docsBox: { backgroundColor: Colors.infoBg, padding: 14, borderRadius: 12, marginTop: 6 },
  docsTitle: { fontWeight: '700', color: Colors.primary, marginBottom: 4, fontSize: 14 },
  docsHint: { fontSize: 11, color: Colors.textLight, marginBottom: 10 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  docItem: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 20 },
  docActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 4 },
  infoBox: { backgroundColor: Colors.warningBg, padding: 12, borderRadius: 10, marginTop: 8 },
  info: { fontSize: 13, color: Colors.text, lineHeight: 18 },
});
