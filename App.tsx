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
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>bldimo</Text>
        <Text style={styles.headerSubtitle}>Simulateur Aide Immobilière • Maroc</Text>
      </View>
      
      <ZelligeAccent />
      <View style={styles.zelligeLine2} />

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
  header: { 
    backgroundColor: Colors.primary, 
    paddingTop: Platform.OS === 'android' ? 36 : 46,
    paddingBottom: 12, 
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: 1,
  },
  headerSubtitle: { 
    color: 'rgba(255,255,255,0.85)', 
    fontSize: 12, 
    marginTop: 2,
  },
  zelligeLine2: {
    height: 3,
    backgroundColor: Colors.secondary,
    opacity: 0.7,
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
