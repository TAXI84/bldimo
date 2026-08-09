import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function ZelligeAccent() {
  return (
    <View style={styles.container}>
      <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primaryDark }]} />
      <View style={[styles.segment, { backgroundColor: '#14B8A6' }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondaryDark }]} />
      <View style={[styles.segment, { backgroundColor: '#0EA5E9' }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
      <View style={[styles.segment, { backgroundColor: Colors.primaryDark }]} />
      <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 5,
    width: '100%',
  },
  segment: {
    flex: 1,
  },
});
