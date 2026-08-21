import { View, StyleSheet } from 'react-native';

export default function MoroccanBackground() {
  return (
    <View style={styles.container}>
      <View style={[styles.rosaceContainer, styles.rosaceTopLeft]}>
        <Rosace size={280} opacity={0.12} />
      </View>
      <View style={[styles.rosaceContainer, styles.rosaceBottomRight]}>
        <Rosace size={320} opacity={0.1} />
      </View>
      <View style={[styles.zelligeContainer, styles.zelligeTopRight]}>
        <GeometricPattern size={200} opacity={0.08} />
      </View>
      <View style={styles.accentContainer}>
        <GeometricPattern size={150} opacity={0.06} />
      </View>
    </View>
  );
}

function Rosace({ size, opacity }: { size: number; opacity: number }) {
  return (
    <View style={[styles.rosaceBase, { width: size, height: size, opacity }]}>
      <View style={[styles.rosaceCenter, { width: size * 0.15, height: size * 0.15 }]} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <View
          key={angle}
          style={[
            styles.rosacePetal,
            {
              width: size * 0.08,
              height: size * 0.25,
              transform: [
                { translateY: -size * 0.25 },
                { rotate: `${angle}deg` },
                { translateY: size * 0.25 },
              ],
            },
          ]}
        />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <View
          key={`diamond-${angle}`}
          style={[
            styles.rosaceDiamond,
            {
              width: size * 0.06,
              height: size * 0.06,
              transform: [{ rotate: `${angle}deg` }, { translateY: -size * 0.35 }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function GeometricPattern({ size, opacity }: { size: number; opacity: number }) {
  return (
    <View style={[styles.patternBase, { width: size, height: size, opacity }]}>
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              styles.patternTile,
              {
                width: size * 0.2,
                height: size * 0.2,
                borderWidth: 1,
                borderColor: '#D4C5B3',
              },
            ]}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7F4EE',
    overflow: 'hidden',
    zIndex: 0,
  },
  rosaceContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosaceTopLeft: { top: -80, left: -100 },
  rosaceBottomRight: { bottom: -120, right: -140 },
  rosaceBase: { alignItems: 'center', justifyContent: 'center' },
  rosaceCenter: {
    position: 'absolute',
    backgroundColor: '#E9E2D7',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#DDD4C7',
  },
  rosacePetal: {
    position: 'absolute',
    backgroundColor: '#EFEAE2',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD4C7',
  },
  rosaceDiamond: {
    position: 'absolute',
    backgroundColor: '#E9E2D7',
    borderWidth: 1,
    borderColor: '#D4C5B3',
    transform: [{ rotate: '45deg' }],
  },
  zelligeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zelligeTopRight: { top: 100, right: -50 },
  patternBase: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  patternTile: { backgroundColor: 'transparent' },
  accentContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -75,
    marginLeft: -75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
