import { useMemo, useRef, useState } from 'react';
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

type TypeFilter = 'all' | 'appartement' | 'maison' | 'villa';
type PriceFilter = 'all' | 'under300' | '300to500' | '500to700';

interface Props {
  onSimulate?: () => void;
}

export default function ProjetsScreen({ onSimulate }: Props) {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [price, setPrice] = useState<PriceFilter>('all');
  const scrollRef = useRef<ScrollView>(null);

  const cities = useMemo(() => {
    const list: string[] = [];
    SAMPLE_PROJECTS.forEach((p) => {
      if (list.indexOf(p.city) === -1) list.push(p.city);
    });
    list.sort();
    return ['all'].concat(list);
  }, []);

  const filtered = useMemo(() => {
    return SAMPLE_PROJECTS.filter((p) => {
      if (city !== 'all' && p.city !== city) return false;
      if (type !== 'all' && p.type !== type) return false;
      const max = p.priceMax != null ? p.priceMax : 700000;
      if (price === 'under300' && max > 300000) return false;
      if (price === '300to500' && (max <= 300000 || max > 500000)) return false;
      if (price === '500to700' && max <= 500000) return false;
      return true;
    });
  }, [city, type, price]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const step = CARD_WIDTH + CARD_MARGIN * 2;
    const i = Math.round(x / step);
    if (i >= 0 && i < filtered.length) setIndex(i);
  };

  const resetScroll = () => {
    setIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: false });
    }
  };

  const openAlOmrane = (project: Project) => {
    Linking.openURL(project.url).catch(() => undefined);
  };

  const typeLabel = (t: string) => {
    if (t === 'appartement') return 'Appartement';
    if (t === 'villa') return 'Villa';
    return 'Maison';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projets éligibles</Text>
      <Text style={styles.subtitle}>≤ 700 000 DH • Habitat • Al Omrane</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
        <Text style={styles.filterLabel}>Ville</Text>
        {cities.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, city === c ? styles.chipActive : null]}
            onPress={() => {
              setCity(c);
              resetScroll();
            }}
          >
            <Text style={[styles.chipText, city === c ? styles.chipTextActive : null]}>
              {c === 'all' ? 'Toutes' : c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
        <Text style={styles.filterLabel}>Type</Text>
        {[
          { value: 'all' as TypeFilter, label: 'Tous' },
          { value: 'appartement' as TypeFilter, label: 'Appart.' },
          { value: 'maison' as TypeFilter, label: 'Maison' },
          { value: 'villa' as TypeFilter, label: 'Villa' },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, type === item.value ? styles.chipActive : null]}
            onPress={() => {
              setType(item.value);
              resetScroll();
            }}
          >
            <Text style={[styles.chipText, type === item.value ? styles.chipTextActive : null]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
        <Text style={styles.filterLabel}>Prix</Text>
        {[
          { value: 'all' as PriceFilter, label: 'Tous' },
          { value: 'under300' as PriceFilter, label: '≤ 300k' },
          { value: '300to500' as PriceFilter, label: '300–500k' },
          { value: '500to700' as PriceFilter, label: '500–700k' },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, price === item.value ? styles.chipActive : null]}
            onPress={() => {
              setPrice(item.value);
              resetScroll();
            }}
          >
            <Text style={[styles.chipText, price === item.value ? styles.chipTextActive : null]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun projet avec ces filtres</Text>
          <TouchableOpacity
            onPress={() => {
              setCity('all');
              setType('all');
              setPrice('all');
              resetScroll();
            }}
          >
            <Text style={styles.resetLink}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listBlock}>
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
            {filtered.map((project) => (
              <View key={project.id} style={styles.cardWrap}>
                <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={() => openAlOmrane(project)}>
                  <View style={[styles.imageArea, { backgroundColor: project.imageColor }]}>
                    <Ionicons name="home" size={48} color="rgba(255,255,255,0.9)" />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{typeLabel(project.type)}</Text>
                    </View>
                    <Text style={styles.tapHint}>Voir sur Al Omrane →</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.cityText}>{project.city}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {project.title}
                    </Text>
                    <Text style={styles.desc} numberOfLines={2}>
                      {project.description}
                    </Text>
                    {project.priceMax != null ? (
                      <Text style={styles.priceMax}>
                        Jusqu'à {project.priceMax.toLocaleString('fr-MA')} DH
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.simButton} activeOpacity={0.85} onPress={() => onSimulate && onSimulate()}>
                  <Ionicons name="calculator-outline" size={20} color="#fff" />
                  <Text style={styles.simButtonText}>Simulation</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.counter}>
            {Math.min(index + 1, filtered.length)} / {filtered.length}
          </Text>
        </View>
      )}

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.primary, paddingHorizontal: 20 },
  subtitle: { fontSize: 12, color: Colors.textLight, paddingHorizontal: 20, marginBottom: 8, marginTop: 2 },
  filtersRow: { maxHeight: 44, marginBottom: 4 },
  filtersContent: { paddingHorizontal: 16, alignItems: 'center', paddingRight: 24 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: Colors.textLight, marginRight: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.text, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  listBlock: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 4 },
  cardWrap: { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,
  },
  imageArea: { height: 140, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tapHint: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  body: { padding: 14 },
  cityText: { fontSize: 13, color: Colors.secondary, fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  desc: { fontSize: 13, color: Colors.textLight, lineHeight: 18 },
  priceMax: { marginTop: 8, fontSize: 14, fontWeight: '700', color: Colors.primary },
  simButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  simButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  counter: { textAlign: 'center', marginTop: 8, marginBottom: 4, fontSize: 12, color: Colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 15, color: Colors.textLight, marginBottom: 12 },
  resetLink: { fontSize: 15, color: Colors.primary, fontWeight: '700' },
});
