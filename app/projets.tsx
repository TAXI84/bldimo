import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_PROJECTS, Project } from '../src/data/projects';
import { Colors } from '../src/constants/theme';
import AdBanner from '../src/components/AdBanner';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_MARGIN = 12;

interface Props {
  onSimulate?: () => void;
}

export default function ProjetsScreen({ onSimulate }: Props) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (CARD_WIDTH + CARD_MARGIN * 2));
    if (i >= 0 && i < SAMPLE_PROJECTS.length) setIndex(i);
  };

  const openAlOmrane = (project: Project) => {
    Linking.openURL(project.url).catch(() => {});
  };

  const typeLabel = (t: Project['type']) => {
    if (t === 'appartement') return 'Appartement';
    if (t === 'villa') return 'Villa';
    return 'Maison';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projets éligibles</Text>
      <Text style={styles.subtitle}>≤ 700 000 DH • Source Al Omrane</Text>
      <View style={styles.typesRow}>
        <Text style={styles.typeTag}>✓ Appartement</Text>
        <Text style={styles.typeTag}>✓ Maison</Text>
        <Text style={styles.typeTag}>✓ Villa</Text>
        <Text style={[styles.typeTag, styles.typeTagNo]}>✗ Commerce</Text>
        <Text style={[styles.typeTag, styles.typeTagNo]}>✗ Terrain</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SAMPLE_PROJECTS.map((project) => (
          <View key={project.id} style={styles.cardWrap}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.95}
              onPress={() => openAlOmrane(project)}
            >
              <View style={[styles.imageArea, { backgroundColor: project.imageColor }]}>
                <Ionicons name="home" size={48} color="rgba(255,255,255,0.9)" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{typeLabel(project.type)}</Text>
                </View>
                <Text style={styles.tapHint}>Fiche Al Omrane →</Text>
              </View>

              <View style={styles.body}>
                <Text style={styles.city}>{project.city}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {project.title}
                </Text>
                <Text style={styles.desc} numberOfLines={3}>
                  {project.description}
                </Text>
                {project.priceMax != null && (
                  <Text style={styles.price}>
                    Jusqu’à {project.priceMax.toLocaleString('fr-MA')} DH
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simButton}
              activeOpacity={0.85}
              onPress={() => onSimulate?.()}
            >
              <Ionicons name="calculator-outline" size={20} color="#fff" />
              <Text style={styles.simButtonText}>Simulation</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SAMPLE_PROJECTS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <Text style={styles.counter}>
        {index + 1} / {SAMPLE_PROJECTS.length}
      </Text>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.primary, paddingHorizontal: 20 },
  subtitle: { fontSize: 13, color: Colors.textLight, paddingHorizontal: 20, marginTop: 4 },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 10,
  },
  typeTag: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeTagNo: { color: Colors.danger, backgroundColor: Colors.dangerBg },
  scrollContent: { paddingHorizontal: 12 },
  cardWrap: { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,
  },
  imageArea: { height: 160, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tapHint: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  body: { padding: 16 },
  city: { fontSize: 13, color: Colors.secondary, fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  desc: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },
  price: { marginTop: 10, fontSize: 14, fontWeight: '700', color: Colors.primary },
  simButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  simButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 14, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.secondary, width: 18 },
  counter: { textAlign: 'center', marginTop: 8, fontSize: 12, color: Colors.textMuted },
});
