import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>bldimo</Text>
        <Text style={styles.headerSubtitle}>Simulateur Aide Immobilière • Maroc</Text>
      </View>
      
      <ZelligeAccent />

      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.tabBar}>
        <TabButton label="Marocain" icon="home" active={activeTab === 'marocain'} onPress={() => setActiveTab('marocain')} />
        <TabButton label="MRE" icon="airplane" active={activeTab === 'mre'} onPress={() => setActiveTab('mre')} />
        <TabButton label="Étranger" icon="globe" active={activeTab === 'etranger'} onPress={() => setActiveTab('etranger')} />
        <TabButton label="Documents" icon="document-text" active={activeTab === 'documents'} onPress={() => setActiveTab('documents')} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, icon, active, onPress }: { label: string; icon: any; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={active ? Colors.primary : '#94A3B8'} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    backgroundColor: Colors.primary, 
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 14, 
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: 1,
  },
  headerSubtitle: { 
    color: 'rgba(255,255,255,0.88)', 
    fontSize: 12, 
    marginTop: 3,
  },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabButton: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 4,
    position: 'relative',
  },
  tabLabel: { 
    fontSize: 11, 
    color: '#94A3B8', 
    marginTop: 3, 
    fontWeight: '500',
  },
  tabLabelActive: { 
    color: Colors.primary, 
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
});
