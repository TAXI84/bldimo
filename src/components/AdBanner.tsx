import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';

const AD_URL = 'https://www.inwi.ma';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.banner}
        activeOpacity={0.85}
        onPress={() => Linking.openURL(AD_URL).catch(() => undefined)}
      >
        <View style={styles.adContent}>
          <View style={styles.adLeft}>
            <Text style={styles.adBrand}>i-dar Duo</Text>
            <Text style={styles.adTitle}>Internet libre et illimité à la maison</Text>
            <Text style={styles.adSubtitle}>✓ Illimité · Sans engagement · Sans installation</Text>
            <Text style={styles.adPrice}>
              À partir de <Text style={styles.adPriceStrong}>199 DH</Text>/mois
            </Text>
          </View>
          <View style={styles.adRight}>
            <Text style={styles.adCta}>DÉCOUVREZ</Text>
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
    backgroundColor: 'transparent',
  },
  banner: {
    backgroundColor: '#9D0A6A',
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingRight: 8,
  },
  adBrand: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  adTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  adSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  adPrice: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  adPriceStrong: {
    fontSize: 15,
    fontWeight: '800',
  },
  adRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginLeft: 8,
  },
  adCta: {
    color: '#9D0A6A',
    fontSize: 12,
    fontWeight: '800',
  },
  adLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
  },
});
