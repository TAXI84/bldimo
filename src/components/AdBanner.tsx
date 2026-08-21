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
            <Text style={styles.adBrand}>i-dar Duo · dès 199 DH/mois</Text>
            <Text style={styles.adTitle} numberOfLines={1}>
              Internet illimité à la maison · sans engagement
            </Text>
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
    paddingTop: Platform.OS === 'android' ? 6 : 8,
    paddingHorizontal: 12,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  banner: {
    backgroundColor: '#9D0A6A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  adLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  adBrand: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  adTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
  adRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adCta: {
    color: '#9D0A6A',
    fontSize: 11,
    fontWeight: '800',
  },
  adLabel: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 8 : 10,
    right: 18,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 8,
    fontWeight: '600',
  },
});
