import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.banner} activeOpacity={0.85}>
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
      </TouchableOpacity>
      <Text style={styles.adLabel}>Publicité</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? 12 : 16,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: '#F7F4EE',
  },
  banner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 90,
  },
  adLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  adBrand: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  adTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  adSubtitle: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 4,
  },
  adRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginLeft: 12,
  },
  adCta: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '800',
  },
  adLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#999',
    fontSize: 9,
    fontWeight: '600',
  },
});
