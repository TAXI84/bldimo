import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarocainScreen from './app/index';
import MREScreen from './app/mre';
import EtrangerScreen from './app/etranger';
import ProjetsScreen from './app/projets';
import ZelligeAccent from './src/components/ZelligeAccent';
import MoroccanBackground from './src/components/MoroccanBackground';
import AdBanner from './src/components/AdBanner';
import { Colors } from './src/constants/theme';

type Tab = 'projets' | 'marocain' | 'mre' | 'etranger';

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

      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <AdBanner />

        <View style={styles.brandingContainer}>
          <Text style={styles.brandingTitle}>bldimo</Text>
          <Text style={styles.brandingSubtitle}>Simulateur Aide Immobilière • Maroc</Text>
        </View>

        <ZelligeAccent />
      </SafeAreaView>

      <View style={styles.contentWrapper}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TabButton
          label="Projets"
          icon="business"
          active={activeTab === 'projets'}
          onPress={() => setActiveTab('projets')}
        />
        <TabButton
          label="Marocain"
          icon="map"
          active={activeTab === 'marocain'}
          onPress={() => setActiveTab('marocain')}
        />
        <TabButton
          label="MRE"
          icon="airplane"
          active={activeTab === 'mre'}
          onPress={() => setActiveTab('mre')}
        />
        <TabButton
          label="Étranger"
          icon="globe"
          active={activeTab === 'etranger'}
          onPress={() => setActiveTab('etranger')}
        />
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
  rootContainer: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  brandingContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  brandingTitle: {
    color: '#005C9E',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  brandingSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
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
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#005C9E',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0D9488',
  },
});
