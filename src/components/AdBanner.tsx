import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AdBanner() {
  return (
    <TouchableOpacity style={styles.banner} activeOpacity={0.9}>
      <View style={styles.adContent}>
        <View style={styles.adLeft}>
          <Text style={styles.adBrand}>ADIDAS</Text>
          <Text style={styles.adTitle}>Nouvelle collection</Text>
          <Text style={styles.adSubtitle}>Découvre les dernières sorties</Text>
        </View>
        <View style={styles.adRight}>
          <Text style={styles.adCta}>VOIR</Text>
        </View>
      </View>
      <Text style={styles.adLabel}>Publicité</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#111',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  adLeft: {
    flex: 1,
  },
  adBrand: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  adTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  adSubtitle: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  adRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adCta: {
    color: '#111',
    fontSize: 13,
    fontWeight: '800',
  },
  adLabel: {
    position: 'absolute',
    top: 6,
    right: 10,
    color: '#666',
    fontSize: 9,
    fontWeight: '600',
  },
});
