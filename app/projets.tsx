import { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
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
import { getProjects, Project } from '../src/data/projects';
import { Colors } from '../src/constants/theme';
import AdBanner from '../src/components/AdBanner';
import ZelligeAccent from '../src/components/ZelligeAccent';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W - 48;
const CARD_MARGIN = 12;

const ALL_PROJECTS = getProjects();

type TypeFilter = 'all' | 'appartement' | 'maison' | 'villa';
interface Props {
  onSimulate?: () => void;
}

function formatDh(n: number) {
  return n.toLocaleString('fr-MA');
}

/** Lignes surface / prix uniquement si données réelles présentes */
function ProjectMeta({ project }: { project: Project }) {
  const hasSurface =
    project.surfaceMin != null || project.surfaceMax != null;
  const hasPrice = project.priceMin != null || project.priceMax != null;

  // Ne rien afficher si aucun des deux
  if (!hasSurface && !hasPrice) return null;

  const surfaceLine = (() => {
    if (!hasSurface) return null;
    const a = project.surfaceMin;
    const b = project.surfaceMax;
    if (a != null && b != null && a !== b) {
      return `de ${a} m² à ${b} m²`;
    }
    const v = a != null ? a : b;
    return v != null ? `${v} m²` : null;
  })();

  const priceLine = (() => {
    if (!hasPrice) return null;
    const a = project.priceMin;
    const b = project.priceMax;
    // Ne pas afficher un faux "Jusqu'à 700000" si c'est juste le plafond filtre sans min réel
    if (a == null && b != null && b >= 700000) return null;
    if (a != null && b != null && a !== b) {
      return `de ${formatDh(a)} DH à ${formatDh(b)} DH`;
    }
    const v = a != null ? a : b;
    return v != null ? `${formatDh(v)} DH` : null;
  })();

  if (!surfaceLine && !priceLine) return null;

  return (
    <View style={styles.metaBlock}>
      {surfaceLine ? <Text style={styles.metaSurface}>{surfaceLine}</Text> : null}
      {priceLine ? <Text style={styles.metaPrice}>{priceLine}</Text> : null}
    </View>
  );
}

export default function ProjetsScreen({ onSimulate }: Props) {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const cities = useMemo(() => {
    const list: string[] = [];
    ALL_PROJECTS.forEach((p) => {
      if (list.indexOf(p.city) === -1) list.push(p.city);
    });
    list.sort();
    return list;
  }, []);

  const filtered = useMemo(
    () =>
      ALL_PROJECTS.filter((p) => {
        if (city !== 'all' && p.city !== city) return false;
        if (type !== 'all' && p.type !== type) return false;
        return true;
      }),
    [city, type]
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (CARD_WIDTH + CARD_MARGIN * 2));
    if (i >= 0 && i < filtered.length) setIndex(i);
  };

  const resetScroll = () => {
    setIndex(0);
    try {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    } catch {
      /* ignore */
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projets éligibles</Text>
      <Text style={styles.subtitle}>
        {`≤ 700 000 DH • ${ALL_PROJECTS.length} projets • Al Omrane`}
      </Text>

      {/* Filtres Ville + Type uniquement */}
      <View style={styles.filterLine}>
        <TouchableOpacity style={styles.dropBtn} onPress={() => setCityOpen(true)}>
          <Text style={styles.dropText} numberOfLines={1}>
            {cityLabel}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropBtn} onPress={() => setTypeOpen(true)}>
          <Text style={styles.dropText}>{typeLabel(type)}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Motif zellige à la place de la barre prix */}
      <View style={styles.zelligeStrip}>
        <View style={styles.zelligeStripSide}>
          <ZelligeAccent />
        </View>
        <View style={styles.zelligeDiamond}>
          <View style={styles.diamondOuter}>
            <View style={styles.diamondInner} />
          </View>
        </View>
        <View style={styles.zelligeStripSide}>
          <ZelligeAccent />
        </View>
      </View>

      <AdBanner />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun projet avec ces filtres</Text>
          <TouchableOpacity
            onPress={() => {
              setCity('all');
              setType('all');
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
                  <View
                    style={[
                      styles.imageArea,
                      { backgroundColor: project.imageColor || '#005C9E' },
                    ]}
                  >
                    {project.imageUrl ? (
                      <Image
                        source={{ uri: project.imageUrl }}
                        style={styles.projectImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="home" size={44} color="rgba(255,255,255,0.9)" />
                    )}
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
                    <ProjectMeta project={project} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simButton}
                  activeOpacity={0.85}
                  onPress={() => onSimulate && onSimulate()}
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
                  <Text
                    style={[
                      styles.modalItemText,
                      city === c ? styles.modalItemActive : null,
                    ]}
                  >
                    {c}
                  </Text>
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
                <Text
                  style={[
                    styles.modalItemText,
                    type === v ? styles.modalItemActive : null,
                  ]}
                >
                  {label}
                </Text>
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textLight,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  filterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 140,
    marginHorizontal: 6,
  },
  dropText: { fontSize: 13, fontWeight: '600', color: Colors.text, maxWidth: 100, marginRight: 4 },
  zelligeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    height: 20,
  },
  zelligeStripSide: { flex: 1, height: 5, overflow: 'hidden', borderRadius: 2 },
  zelligeDiamond: { width: 24, alignItems: 'center', justifyContent: 'center' },
  diamondOuter: {
    width: 12,
    height: 12,
    backgroundColor: Colors.secondary,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: { width: 5, height: 5, backgroundColor: Colors.primary },
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
  imageArea: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  projectImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%' as any,
    height: '100%' as any,
  },
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
  cityText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  metaBlock: { marginTop: 2 },
  metaSurface: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
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
  counter: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
    fontSize: 12,
    color: Colors.textMuted,
  },
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemText: { fontSize: 15, color: Colors.text },
  modalItemActive: { color: Colors.primary, fontWeight: '700' },
});
