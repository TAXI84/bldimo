import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Accent décoratif subtil inspiré du zellige marocain.
 * Bande géométrique utilisée sous le header.
 */
export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primaryDark }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondaryDark }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  segment: {
    flex: 1,
  },
});
