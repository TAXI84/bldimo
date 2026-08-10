import { View, StyleSheet } from 'react-native';

export default function MoroccanBackground() {
  return (
    <View style={styles.container}>
      <View style={styles.pattern}>
        {/* Motifs géométriques marocains subtils - grille zellige */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <View
              key={`${row}-${col}`}
              style={[
                styles.tile,
                {
                  left: col * 50,
                  top: row * 60,
                  opacity: (row + col) % 3 === 0 ? 0.08 : 0.04,
                  transform: [{ rotate: `${(row + col) * 5}deg` }],
                },
              ]}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F5F0',
    overflow: 'hidden',
    zIndex: 0,
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
  },
  tile: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#D4C5B3',
    borderRadius: 2,
  },
});
