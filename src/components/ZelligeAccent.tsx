import { View, Text, StyleSheet } from 'react-native';

/** Bandeau zellige centré : losange | ligne | rosace | ligne | losange */
export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      <Text style={styles.diamond}>◇</Text>
      <View style={styles.line} />
      <View style={styles.rosace}>
        <View style={styles.rosaceOuter} />
        <View style={styles.rosaceMid} />
        <View style={styles.rosaceCore} />
      </View>
      <View style={styles.line} />
      <Text style={styles.diamond}>◇</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 28,
    height: 36,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#0D9488',
    marginHorizontal: 10,
  },
  diamond: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: '700',
  },
  rosace: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosaceOuter: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#006233',
  },
  rosaceMid: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C1272D',
  },
  rosaceCore: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F7F4EE',
  },
});
