import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MarocainScreen from './app/index';
import MREScreen from './app/mre';
import EtrangerScreen from './app/etranger';
import DocumentsScreen from './app/documents';
import ZelligeAccent from './src/components/ZelligeAccent';
import { Colors } from './src/constants/theme';

type Tab = 'marocain' | 'mre' | 'etranger' | 'documents';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('marocain');

  const renderScreen = () => {
    switch (activeTab) {
      case 'marocain': return <MarocainScreen />;
      case 'mre': return <MREScreen />;
      case 'etranger': return <EtrangerScreen />;
      case 'documents': return <DocumentsScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      
      <TouchableOpacity style={styles.adHeader} activeOpacity={0.9}>
        <View style={styles.adContent}>
          <View style={styles.adLeft}>
            <Text style={styles.adBrand}>ADIDAS</Text>
            <Text style={styles.adTitle}>Nouvelle collection</Text>
            <Text style={styles.adSub}>Découvre les dernières sorties</Text>
          </View>
          <View style={styles.adBtn}>
            <Text style={styles.adBtnText}>VOIR</Text>
          </View>
        </View>
        <Text style={styles.adLabel}>Publicité</Text>
      </TouchableOpacity>

      <ZelligeAccent />

      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.tabBar}>
        <TabButton label="Marocain" icon="map" active={activeTab === 'marocain'} onPress={() => setActiveTab('marocain')} />
        <TabButton label="MRE" icon="airplane" active={activeTab === 'mre'} onPress={() => setActiveTab('mre')} />
        <TabButton label="Étranger" icon="globe" active={activeTab === 'etranger'} onPress={() => setActiveTab('etranger')} />
        <TabButton label="Documents" icon="document-text" active={activeTab === 'documents'} onPress={() => setActiveTab('documents')} />
      </View>
    </View>
  );
}

function TabButton({ label, icon, active, onPress }: { label: string; icon: any; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={24} color={active ? Colors.primary : '#94A3B8'} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  adHeader: {
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'android' ? 36 : 46,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adLeft: { flex: 1 },
  adBrand: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  adTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  adSub: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 1,
  },
  adBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adBtnText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 13,
  },
  adLabel: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 38 : 48,
    right: 12,
    color: '#555',
    fontSize: 9,
    fontWeight: '600',
  },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 48 : 34,
    elevation: 20,
  },
  tabButton: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 6,
    position: 'relative',
  },
  tabLabel: { 
    fontSize: 11, 
    color: '#94A3B8', 
    marginTop: 4, 
    fontWeight: '500',
  },
  tabLabelActive: { 
    color: Colors.primary, 
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
});
