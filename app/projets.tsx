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
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_PROJECTS, Project } from '../src/data/projects';
import { Colors } from '../src/constants/theme';
import AdBanner from '../src/components/AdBanner';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_MARGIN = 12;

const PRICE_MIN = 25000;
const PRICE_MAX = 700000;
const PRICE_STEP = 1000;

type TypeFilter = 'all' | 'appartement' | 'maison' | 'villa';

interface Props {
  onSimulate?: () => void;
}

export default function ProjetsScreen({ onSimulate }: Props) {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const cities = useMemo(() => {
    const list: string[] = [];
    SAMPLE_PROJECTS.forEach((p) => {
      if (list.indexOf(p.city) === -1) list.push(p.city);
    });
    list.sort();
    return list;
  }, []);

  const filtered = useMemo(() => {
    return SAMPLE_PROJECTS.filter((p) => {
      if (city !== 'all' && p.city !== city) return false;
      if (type !== 'all' && p.type !== type) return false;
      const max = p.priceMax != null ? p.priceMax : 700000;
      if (max > maxPrice) return false;
      return true;
    });
  }, [city, type, maxPrice]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const step = CARD_WIDTH + CARD_MARGIN * 2;
    const i = Math.round(x / step);
    if (i >= 0 && i < filtered.length) setIndex(i);
  };

  const resetScroll = () => {
    setIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  };

  const openAlOmrane = (project: Project) => {
    Linking.openURL(project.url).catch(() => undefined);
  };

  const typeLabel = (t: string) => {
    if (t === 'all') return 'Type';
    if (t === 'appartement') return 'Appart.';
    if (t === 'villa') return 'Villa';
    return 'Maison';
  };

  const cityLabel = city === 'all' ? 'Ville' : city;

  const decPrice = () => {
    setMaxPrice((v) => {
      const n = Math.max(PRICE_MIN, v - PRICE_STEP);
      resetScroll();
      return n;
    });
  };
  const incPrice = () => {
    setMaxPrice((v) => {
      const n = Math.min(PRICE_MAX, v + PRICE_STEP);
      resetScroll();
      return n;
    });
  };
  const setPriceBucket = (v: number) => {
    setMaxPrice(Math.min(PRICE_MAX, Math.max(PRICE_MIN, v)));
    resetScroll();
  };

  const sliderRatio = (maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projets éligibles</Text>
      <Text style={styles.subtitle}>≤ 700 000 DH • Habitat • Al Omrane</Text>

      <View style={styles.filterLine}>
        <TouchableOpacity style={styles.dropBtn} onPress={() => setCityOpen(true)}>
          <Text style={styles.dropText} numberOfLines={1}>{cityLabel}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropBtn} onPress={() => setTypeOpen(true)}>
          <Text style={styles.dropText}>{typeLabel(type)}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textLight} />
        </TouchableOpacity>

        <View style={styles.priceBox}>
          <TouchableOpacity onPress={decPrice} hitSlop={8}>
            <Ionicons name="remove-circle-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.priceValue}>{(maxPrice / 1000).toFixed(0)}k</Text>
          <TouchableOpacity onPress={incPrice} hitSlop={8}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sliderRow}>
        <Text style={styles.sliderHint}>25k</Text>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${sliderRatio * 100}%` as any }]} />
          <View style={[styles.sliderThumb, { left: `${Math.min(96, sliderRatio * 100)}%` as any }]} />
          <View style={styles.sliderTouchRow}>
            {[25000, 100000, 200000, 300000, 400000, 500000, 600000, 700000].map((v) => (
              <TouchableOpacity key={v} style={styles.sliderTouch} onPress={() => setPriceBucket(v)} />
            ))}
          </View>
        </View>
        <Text style={styles.sliderHint}>700k</Text>
      </View>
      <Text style={styles.priceCaption}>
        Prix max : {maxPrice.toLocaleString('fr-MA')} DH (±1 000)
      </Text>

      <AdBanner />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun projet avec ces filtres</Text>
          <TouchableOpacity
            onPress={() => {
              setCity('all');
              setType('all');
              setMaxPrice(PRICE_MAX);
              resetScroll();
            }}
          >
            <Text style={styles.resetLink}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.95}
                  onPress={() => openAlOmrane(project)}
                >
                  <View style={[styles.imageArea, { backgroundColor: project.imageColor }]}>
                    <Ionicons name="home" size={44} color="rgba(255,255,255,0.9)" />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{typeLabel(project.type)}</Text>
                    </View>
                    <Text style={styles.tapHint}>Voir sur Al Omrane →</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.cityText}>{project.city}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>{project.title}</Text>
                    <Text style={styles.desc} numberOfLines={2}>{project.description}</Text>
                    {project.priceMax != null && (
                      <Text style={styles.priceMax}>
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
          <Text style={styles.counter}>
            {Math.min(index + 1, filtered.length)} / {filtered.length}
          </Text>
        </>
      )}

      <Modal visible={cityOpen} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setCityOpen(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Ville</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setCity('all');
                  setCityOpen(false);
                  resetScroll();
                }}
              >
                <Text style={styles.modalItemText}>Toutes</Text>
              </TouchableOpacity>
              {cities.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.modalItem}
                  onPress={() => {
                    setCity(c);
                    setCityOpen(false);
                    resetScroll();
                  }}
                >
                  <Text style={[styles.modalItemText, city === c && styles.modalItemActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={typeOpen} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setTypeOpen(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Type de bien</Text>
            {(
              [
                ['all', 'Tous'],
                ['appartement', 'Appartement'],
                ['maison', 'Maison'],
                ['villa', 'Villa'],
              ] as const
            ).map(([v, label]) => (
              <TouchableOpacity
                key={v}
                style={styles.modalItem}
                onPress={() => {
                  setType(v);
                  setTypeOpen(false);
                  resetScroll();
                }}
              >
                <Text style={[styles.modalItemText, type === v && styles.modalItemActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 10 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.primary, paddingHorizontal: 16 },
  subtitle: { fontSize: 12, color: Colors.textLight, paddingHorizontal: 16, marginBottom: 8, marginTop: 2 },
  filterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 6,
  },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 110,
    gap: 4,
  },
  dropText: { fontSize: 13, fontWeight: '600', color: Colors.text, maxWidth: 80 },
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  priceValue: { fontSize: 14, fontWeight: '800', color: Colors.primary, minWidth: 40, textAlign: 'center' },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 2,
  },
  sliderHint: { fontSize: 10, color: Colors.textMuted, width: 28 },
  sliderTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginLeft: -8,
    top: -4,
  },
  sliderTouchRow: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  sliderTouch: { flex: 1 },
  priceCaption: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  scrollContent: { paddingHorizontal: 12, paddingTop: 4 },
  cardWrap: { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  imageArea: { height: 130, alignItems: 'center', justifyContent: 'center' },
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
  body: { padding: 12 },
  cityText: { fontSize: 12, color: Colors.secondary, fontWeight: '700', marginBottom: 2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  desc: { fontSize: 12, color: Colors.textLight, lineHeight: 17 },
  priceMax: { marginTop: 6, fontSize: 13, fontWeight: '700', color: Colors.primary },
  simButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  simButtonText: { color: '#fff', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  counter: { textAlign: 'center', marginTop: 6, marginBottom: 4, fontSize: 12, color: Colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 15, color: Colors.textLight, marginBottom: 12 },
  resetLink: { fontSize: 15, color: Colors.primary, fontWeight: '700' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 12 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalItemText: { fontSize: 15, color: Colors.text },
  modalItemActive: { color: Colors.primary, fontWeight: '700' },
});
