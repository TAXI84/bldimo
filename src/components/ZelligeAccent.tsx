import { View, Text, StyleSheet } from 'react-native';

export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      <View style={styles.lineLeft} />
      <View style={styles.rosaceWrapper}>
        <View style={styles.rosaceContainer}>
          <View style={styles.rosaceCenter} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <View key={angle} style={[styles.petal, { transform: [{ rotate: `${angle}deg` }] }]} />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <View key={`d-${angle}`} style={[styles.diamond, { transform: [{ rotate: `${angle}deg` }] }]} />
          ))}
        </View>
      </View>
      <View style={styles.lineRight} />
      <Text style={styles.accentLeft}>◇</Text>
      <Text style={styles.accentRight}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
    paddingHorizontal: 16,
  },
  lineLeft: { flex: 1, height: 2, backgroundColor: '#0D9488' },
  lineRight: { flex: 1, height: 2, backgroundColor: '#0D9488' },
  rosaceWrapper: { alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  rosaceContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  rosaceCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488',
    zIndex: 10,
  },
  petal: {
    position: 'absolute',
    width: 3,
    height: 12,
    backgroundColor: '#005C9E',
    borderRadius: 2,
    top: 2,
  },
  diamond: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: '#D5A34A',
    top: 8,
  },
  accentLeft: { color: '#0D9488', fontSize: 16, fontWeight: 'bold', marginLeft: 6 },
  accentRight: { color: '#D5A34A', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
});
