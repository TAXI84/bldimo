import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const AD_URL = 'https://www.inwi.ma';

export default function AdBanner() {
  const open = () => {
    Linking.openURL(AD_URL).catch(() => undefined);
  };

  return (
    <TouchableOpacity style={styles.banner} activeOpacity={0.92} onPress={open}>
      <Text style={styles.adLabel}>Publicité</Text>
      <View style={styles.adContent}>
        <View style={styles.adLeft}>
          <Text style={styles.adBrand}>i-dar Duo</Text>
          <Text style={styles.adTitle}>Internet libre et illimité à la maison</Text>
          <Text style={styles.adBullet}>✓ Illimité · Sans engagement · Sans installation</Text>
          <Text style={styles.adPrice}>
            À partir de <Text style={styles.adPriceStrong}>199 DH</Text>/mois
          </Text>
        </View>
        <View style={styles.adRight}>
          <Text style={styles.adCta}>DÉCOUVREZ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#9D0A6A',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  adLeft: {
    flex: 1,
    paddingRight: 8,
  },
  adBrand: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  adTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  adBullet: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 4,
  },
  adPrice: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  adPriceStrong: {
    fontSize: 16,
    fontWeight: '800',
  },
  adRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  adCta: {
    color: '#9D0A6A',
    fontSize: 11,
    fontWeight: '800',
  },
  adLabel: {
    position: 'absolute',
    top: 5,
    right: 10,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '600',
    zIndex: 2,
  },
});
