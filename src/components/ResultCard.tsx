import { View, Text, StyleSheet } from 'react-native';
import { SimulationResult } from '../types';
import { Colors } from '../constants/theme';

interface Props {
  result: SimulationResult;
}

export default function ResultCard({ result }: Props) {
  return (
    <View style={styles.card}>
      <View style={[
        styles.summaryBox,
        result.isEligibleForAny ? styles.summarySuccess : styles.summaryNeutral
      ]}>
        <Text style={styles.summary}>{result.summary}</Text>
      </View>

      {result.devices.map((device, idx) => (
        <View key={idx} style={styles.deviceBox}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={[
              styles.badge,
              device.eligible ? styles.badgeSuccess : styles.badgeDanger
            ]}>
              <Text style={styles.badgeText}>
                {device.eligible ? 'ÉLIGIBLE' : 'NON ÉLIGIBLE'}
              </Text>
            </View>
          </View>
          
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

      {result.notaryFees > 0 && (
        <View style={styles.infoBox}>
          <Text style={styles.info}>
            ℹ️ Frais de notaire plafonnés à {result.notaryFees.toLocaleString('fr-MA')} DH (logements ≤ 700 000 DH)
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  summarySuccess: {
    backgroundColor: Colors.successBg,
  },
  summaryNeutral: {
    backgroundColor: Colors.infoBg,
  },
  summary: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },
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
    marginBottom: 8,
    gap: 8,
  },
  deviceName: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.primary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeSuccess: {
    backgroundColor: Colors.secondary,
  },
  badgeDanger: {
    backgroundColor: Colors.danger,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.secondary,
    marginVertical: 6,
  },
  list: {
    marginTop: 6,
  },
  advantage: {
    color: Colors.secondaryDark,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 2,
  },
  refusal: {
    color: Colors.danger,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 2,
  },
  infoBox: {
    backgroundColor: Colors.infoBg,
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  info: {
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
});
