import { useMemo, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking,
  NativeSyntheticEvent, NativeScrollEvent, Modal, Pressable, PanResponder, LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_PROJECTS, Project } from '../src/data/projects';
import { Colors } from '../src/constants/theme';
import AdBanner from '../src/components/AdBanner';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W - 48;
const CARD_MARGIN = 12;
const PRICE_MIN = 25000;
const PRICE_MAX = 700000;
const PRICE_STEP = 1000;

type TypeFilter = 'all' | 'appartement' | 'maison' | 'villa';
interface Props { onSimulate?: () => void; }

function snapPrice(v: number) {
  const clamped = Math.min(PRICE_MAX, Math.max(PRICE_MIN, v));
  return Math.round(clamped / PRICE_STEP) * PRICE_STEP;
}

export default function ProjetsScreen({ onSimulate }: Props) {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [dragging, setDragging] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(Math.max(1, SCREEN_W - 80));
  const trackPageX = useRef(0);

  const cities = useMemo(() => {
    const list: string[] = [];
    SAMPLE_PROJECTS.forEach((p) => { if (list.indexOf(p.city) === -1) list.push(p.city); });
    list.sort();
    return list;
  }, []);

  const filtered = useMemo(() => SAMPLE_PROJECTS.filter((p) => {
    if (city !== 'all' && p.city !== city) return false;
    if (type !== 'all' && p.type !== type) return false;
    const max = p.priceMax != null ? p.priceMax : 700000;
    return max <= maxPrice;
  }), [city, type, maxPrice]);

  const ratio = (maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);

  const applyPageX = useCallback((pageX: number) => {
    const w = Math.max(1, trackWidth.current);
    const local = pageX - trackPageX.current;
    const r = Math.min(1, Math.max(0, local / w));
    setMaxPrice(snapPrice(PRICE_MIN + r * (PRICE_MAX - PRICE_MIN)));
  }, []);

  const measureTrack = useCallback(() => {
    const node = trackRef.current as any;
    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((x: number, _y: number, width: number) => {
        if (typeof x === 'number') trackPageX.current = x;
        if (width > 0) trackWidth.current = width;
      });
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        try {
          measureTrack();
          setDragging(true);
          if (typeof evt.nativeEvent.pageX === 'number') applyPageX(evt.nativeEvent.pageX);
        } catch { setDragging(true); }
      },
      onPanResponderMove: (evt) => {
        try {
          if (typeof evt.nativeEvent.pageX === 'number') applyPageX(evt.nativeEvent.pageX);
        } catch { /* ignore */ }
      },
      onPanResponderRelease: () => {
        setDragging(false);
        setIndex(0);
        try { scrollRef.current?.scrollTo({ x: 0, animated: false }); } catch { /* ignore */ }
      },
      onPanResponderTerminate: () => setDragging(false),
    })
  ).current;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    try {
      const w = e.nativeEvent.layout.width;
      if (w > 0) trackWidth.current = w;
      measureTrack();
    } catch { /* ignore */ }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (CARD_WIDTH + CARD_MARGIN * 2));
    if (i >= 0 && i < filtered.length) setIndex(i);
  };

  const resetScroll = () => {
    setIndex(0);
    try { scrollRef.current?.scrollTo({ x: 0, animated: false }); } catch { /* ignore */ }
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
  const bubbleLeft = 20 + ratio * Math.max(40, trackWidth.current - 40);

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
        <View style={styles.priceHint}><Text style={styles.priceHintText}>Prix max</Text></View>
      </View>

      <View style={styles.sliderBlock}>
        {dragging ? (
          <View style={[styles.bubble, { left: bubbleLeft }]}>
            <Text style={styles.bubbleText}>{maxPrice.toLocaleString('fr-MA')} DH</Text>
            <View style={styles.bubbleArrow} />
          </View>
        ) : null}

        <View style={styles.sliderRow}>
          <Text style={styles.sliderHint}>25k</Text>
          <View ref={trackRef} style={styles.sliderTrack} onLayout={onTrackLayout} {...panResponder.panHandlers}>
            <View style={styles.sliderTrackBg} />
            <View style={[styles.sliderFill, { width: `${ratio * 100}%` as any }]} />
            <View style={[
              styles.sliderThumb,
              { left: `${Math.min(97, Math.max(3, ratio * 100))}%` as any },
              dragging ? styles.sliderThumbActive : null,
            ]} />
          </View>
          <Text style={styles.sliderHint}>700k</Text>
        </View>

        {!dragging ? (
          <Text style={styles.priceCaption}>{maxPrice.toLocaleString('fr-MA')} DH</Text>
        ) : <View style={{ height: 18 }} />}
      </View>

      <AdBanner />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun projet avec ces filtres</Text>
          <TouchableOpacity onPress={() => { setCity('all'); setType('all'); setMaxPrice(PRICE_MAX); resetScroll(); }}>
            <Text style={styles.resetLink}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2} decelerationRate="fast"
            contentContainerStyle={styles.scrollContent} onScroll={onScroll} scrollEventThrottle={16}>
            {filtered.map((project) => (
              <View key={project.id} style={styles.cardWrap}>
                <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={() => openAlOmrane(project)}>
                  <View style={[styles.imageArea, { backgroundColor: project.imageColor }]}>
                    <Ionicons name="home" size={44} color="rgba(255,255,255,0.9)" />
                    <View style={styles.badge}><Text style={styles.badgeText}>{typeLabel(project.type)}</Text></View>
                    <Text style={styles.tapHint}>Voir sur Al Omrane →</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.cityText}>{project.city}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>{project.title}</Text>
                    <Text style={styles.desc} numberOfLines={2}>{project.description}</Text>
                    {project.priceMax != null ? (
                      <Text style={styles.priceMax}>Jusqu’à {project.priceMax.toLocaleString('fr-MA')} DH</Text>
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
          <Text style={styles.counter}>{Math.min(index + 1, filtered.length)} / {filtered.length}</Text>
        </>
      )}

      <Modal visible={cityOpen} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setCityOpen(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Ville</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              <TouchableOpacity style={styles.modalItem} onPress={() => { setCity('all'); setCityOpen(false); resetScroll(); }}>
                <Text style={styles.modalItemText}>Toutes</Text>
              </TouchableOpacity>
              {cities.map((c) => (
                <TouchableOpacity key={c} style={styles.modalItem} onPress={() => { setCity(c); setCityOpen(false); resetScroll(); }}>
                  <Text style={[styles.modalItemText, city === c ? styles.modalItemActive : null]}>{c}</Text>
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
            {([['all', 'Tous'], ['appartement', 'Appartement'], ['maison', 'Maison'], ['villa', 'Villa']] as const).map(([v, label]) => (
              <TouchableOpacity key={v} style={styles.modalItem} onPress={() => { setType(v); setTypeOpen(false); resetScroll(); }}>
                <Text style={[styles.modalItemText, type === v ? styles.modalItemActive : null]}>{label}</Text>
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
  filterLine: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  dropBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border, maxWidth: 120, gap: 4 },
  dropText: { fontSize: 13, fontWeight: '600', color: Colors.text, maxWidth: 90 },
  priceHint: { flex: 1, alignItems: 'flex-end', paddingRight: 4 },
  priceHintText: { fontSize: 12, color: Colors.textLight, fontWeight: '600' },
  sliderBlock: { paddingHorizontal: 8, marginBottom: 4, minHeight: 58, justifyContent: 'flex-end' },
  bubble: { position: 'absolute', top: 0, marginLeft: -50, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, zIndex: 20, minWidth: 100, alignItems: 'center' },
  bubbleText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bubbleArrow: { position: 'absolute', bottom: -6, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: Colors.primary },
  sliderRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 8, marginTop: 30 },
  sliderHint: { fontSize: 10, color: Colors.textMuted, width: 28 },
  sliderTrack: { flex: 1, height: 40, justifyContent: 'center' },
  sliderTrackBg: { position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  sliderFill: { position: 'absolute', left: 0, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  sliderThumb: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, marginLeft: -14, top: 6, elevation: 6, borderWidth: 3, borderColor: '#fff' },
  sliderThumbActive: { transform: [{ scale: 1.2 }], backgroundColor: Colors.secondary },
  priceCaption: { fontSize: 13, color: Colors.text, fontWeight: '700', textAlign: 'center', marginTop: 2, marginBottom: 2 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 4 },
  cardWrap: { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
  card: { backgroundColor: Colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, elevation: 3 },
  imageArea: { height: 130, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tapHint: { position: 'absolute', bottom: 8, right: 12, color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '600' },
  body: { padding: 12 },
  cityText: { fontSize: 12, color: Colors.secondary, fontWeight: '700', marginBottom: 2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  desc: { fontSize: 12, color: Colors.textLight, lineHeight: 17 },
  priceMax: { marginTop: 6, fontSize: 13, fontWeight: '700', color: Colors.primary },
  simButton: { marginTop: 8, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  simButtonText: { color: '#fff', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  counter: { textAlign: 'center', marginTop: 6, marginBottom: 4, fontSize: 12, color: Colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 15, color: Colors.textLight, marginBottom: 12 },
  resetLink: { fontSize: 15, color: Colors.primary, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, maxHeight: '70%' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 12 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalItemText: { fontSize: 15, color: Colors.text },
  modalItemActive: { color: Colors.primary, fontWeight: '700' },
});
