import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MarocainScreen from './app/index';
import MREScreen from './app/mre';
import EtrangerScreen from './app/etranger';
import ProjetsScreen from './app/projets';
import ZelligeAccent from './src/components/ZelligeAccent';
import MoroccanBackground from './src/components/MoroccanBackground';
import AdBanner from './src/components/AdBanner';

type Tab = 'projets' | 'marocain' | 'mre' | 'etranger';

const FLAG_GREEN = '#006233';
const FLAG_RED = '#C1272D';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('projets');

  const renderScreen = () => {
    switch (activeTab) {
      case 'projets':
        return <ProjetsScreen onSimulate={() => setActiveTab('marocain')} />;
      case 'marocain':
        return <MarocainScreen />;
      case 'mre':
        return <MREScreen />;
      case 'etranger':
        return <EtrangerScreen />;
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4EE" />

      <MoroccanBackground />

      <View style={styles.headerContainer}>
        <AdBanner />

        <View style={styles.brandingContainer}>
          {/* Mot complet style Amazon : bld + immo + smile en dessous */}
          <View style={styles.logoWord}>
            <Text style={styles.brandBld}>bld</Text>
            <Text style={styles.brandImmo}>immo</Text>
          </View>

          {/* Arc sourire façon Amazon (sous le mot, de b à o) */}
          <View style={styles.smileWrap}>
            <View style={styles.smileArc} />
            <View style={styles.smileArrow} />
          </View>

          <Text style={styles.brandingSubtitle}>Simulateur Aide Immobilière • Maroc</Text>
        </View>

        <ZelligeAccent />
      </View>

      <View style={styles.contentWrapper}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TabButton label="Projets" icon="business" active={activeTab === 'projets'} onPress={() => setActiveTab('projets')} />
        <TabButton label="Marocain" icon="map" active={activeTab === 'marocain'} onPress={() => setActiveTab('marocain')} />
        <TabButton label="MRE" icon="airplane" active={activeTab === 'mre'} onPress={() => setActiveTab('mre')} />
        <TabButton label="Étranger" icon="globe" active={activeTab === 'etranger'} onPress={() => setActiveTab('etranger')} />
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: any;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={24} color={active ? '#005C9E' : '#94A3B8'} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#F7F4EE' },
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44,
  },
  brandingContainer: {
    paddingTop: 6,
    paddingBottom: 2,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWord: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  brandBld: {
    color: FLAG_GREEN,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
    includeFontPadding: false,
  },
  brandImmo: {
    color: FLAG_RED,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
    includeFontPadding: false,
  },
  smileWrap: {
    width: 130,
    height: 18,
    marginTop: -2,
    marginBottom: 4,
    alignSelf: 'center',
    position: 'relative',
  },
  /* Demi-cercle = sourire Amazon */
  smileArc: {
    position: 'absolute',
    left: 8,
    right: 18,
    top: 0,
    height: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: FLAG_RED,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    backgroundColor: 'transparent',
  },
  /* Petite flèche au bout du smile (comme Amazon) */
  smileArrow: {
    position: 'absolute',
    right: 10,
    bottom: 4,
    width: 10,
    height: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: FLAG_RED,
    transform: [{ rotate: '45deg' }],
  },
  brandingSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  contentWrapper: { flex: 1, backgroundColor: 'transparent', zIndex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 48 : 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 8, position: 'relative' },
  tabLabel: { fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  tabLabelActive: { color: '#005C9E', fontWeight: '700' },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0D9488',
  },
});
