import { View, StyleSheet } from 'react-native';

/** Bandeau zellige parfaitement centré : ligne | rosace | ligne */
export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.centerGroup}>
        <View style={styles.diamondLeft} />
        <View style={styles.rosace}>
          <View style={styles.rosaceOuter} />
          <View style={styles.rosaceMid} />
          <View style={styles.rosaceCore} />
        </View>
        <View style={styles.diamondRight} />
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 32,
    height: 32,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#0D9488',
    borderRadius: 1,
  },
  centerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  diamondLeft: {
    width: 8,
    height: 8,
    backgroundColor: '#006233',
    transform: [{ rotate: '45deg' }],
    marginRight: 8,
  },
  diamondRight: {
    width: 8,
    height: 8,
    backgroundColor: '#C1272D',
    transform: [{ rotate: '45deg' }],
    marginLeft: 8,
  },
  rosace: {
    width: 20,
    height: 20,
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
