import { View, Text, StyleSheet } from 'react-native';

export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      {/* Ligne turquoise gauche */}
      <View style={styles.lineLeft} />

      {/* Rosace centrale */}
      <View style={styles.rosaceWrapper}>
        <View style={styles.rosaceContainer}>
          {/* Cercle central turquoise */}
          <View style={styles.rosaceCenter} />
          
          {/* 8 pétales */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <View
              key={angle}
              style={[
                styles.petal,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          ))}

          {/* 8 petits losanges */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <View
              key={`diamond-${angle}`}
              style={[
                styles.diamond,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Ligne turquoise droite */}
      <View style={styles.lineRight} />

      {/* Petits accents géométriques */}
      <View style={styles.accentLeft}>◇</View>
      <View style={styles.accentRight}>✦</View>
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
    gap: 12,
  },

  lineLeft: {
    flex: 1,
    height: 2,
    backgroundColor: '#0D9488', // turquoise
  },

  lineRight: {
    flex: 1,
    height: 2,
    backgroundColor: '#0D9488', // turquoise
  },

  rosaceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  rosaceContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rosaceCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488', // turquoise
    zIndex: 10,
  },

  petal: {
    position: 'absolute',
    width: 3,
    height: 12,
    backgroundColor: '#005C9E', // bleu BLDIMO
    borderRadius: 2,
    top: 2,
  },

  diamond: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: '#D5A34A', // or/sable
    top: 8,
    transform: [{ rotate: '45deg' }],
  },

  accentLeft: {
    color: '#0D9488',
    fontSize: 16,
    fontWeight: 'bold',
  },

  accentRight: {
    color: '#D5A34A',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
