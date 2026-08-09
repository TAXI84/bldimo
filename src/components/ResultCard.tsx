import { View, Text, StyleSheet } from 'react-native';
import { SimulationResult } from '../types';
import { Colors } from '../constants/theme';

interface Props {
  result: SimulationResult;
}

export default function ResultCard({ result }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.summary}>{result.summary}</Text>

      {result.devices.map((device, idx) => (
        <View key={idx} style={styles.deviceBox}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={{ 
            color: device.eligible ? Colors.secondary : Colors.danger, 
            fontWeight: 'bold',
            marginBottom: 6
          }}>
            {device.eligible ? '✅ ÉLIGIBLE' : '❌ NON ÉLIGIBLE'}
          </Text>
          
          {device.amount != null && (
            <Text style={styles.amount}>{device.amount.toLocaleString('fr-MA')} DH</Text>
          )}

          {device.advantages.length > 0 && (
            <View style={{ marginTop: 6 }}>
              {device.advantages.map((a, i) => (
                <Text key={i} style={styles.advantage}>• {a}</Text>
              ))}
            </View>
          )}

          {device.refusalReasons.length > 0 && (
            <View style={{ marginTop: 6 }}>
              {device.refusalReasons.map((r, i) => (
                <Text key={i} style={styles.refusal}>• {r}</Text>
              ))}
            </View>
          )}
        </View>
      ))}

      {result.notaryFees > 0 && (
        <Text style={styles.info}>
          ℹ️ Frais de notaire plafonnés à {result.notaryFees.toLocaleString('fr-MA')} DH pour les logements ≤ 700 000 DH.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  deviceBox: {
    backgroundColor: '#f5f7fa',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: Colors.primary,
  },
  amount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginTop: 4,
  },
  advantage: {
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  refusal: {
    color: Colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
  info: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});
