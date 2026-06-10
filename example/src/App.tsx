import React, { useCallback, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, Pressable, StyleSheet } from 'react-native'
import {
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  useDerivedValue,
  interpolateColor,
  Easing,
} from 'react-native-reanimated'


import Animated, {
  FadeInDown,
  FadeOutUp,
  ZoomIn,
  ZoomOut,
  BounceIn,
  FlipInEasyX,
  FlipOutEasyX,
  LinearTransition,
  Keyframe,
} from 'react-native-reanimated'
import { AnimatedSquircleView, SquircleView } from '@pankajtime12/react-native-squircle-view'



/**
 * Shared layout transition used on EVERY Animated.View wrapper throughout
 * the file. Having a single reference ensures all layout levels animate with
 * the same spring curve, eliminating the "jump" that occurs when a child exits
 * and the parent/siblings haven't been told to animate their positions.
 */
const LT = LinearTransition.springify().damping(16).stiffness(120)

/**
 * Delayed variant used on the KeyframeDemo outer wrapper when COLLAPSING.
 * The delay (360ms) is intentionally longer than the exit animation (350ms)
 * so the wrapper holds its current height while the cards fade out, then
 * springs to the new smaller height after the exit has visually completed.
 * When EXPANDING, the non-delayed LT is used so the wrapper grows immediately.
 */
const LT_COLLAPSE = LinearTransition.springify().damping(16).stiffness(120).delay(360)

export default function App() {
  return (
    <Animated.View layout={LT} style={{ flex: 1, backgroundColor: '#0f0f14' }}>
      <StatusBar style="light" />
      <Animated.ScrollView layout={LT}>
        <Animated.View
          layout={LT}
          style={{ padding: 24, paddingTop: 60, gap: 24 }}
        >
          <SectionLabel>Solid fill</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              cornerRadius: 36,
              cornerSmoothing: 1,
              fillColor: '#56CDF2',
            }}
          />

          <SectionLabel>Linear gradient — horizontal</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              cornerRadius: 36,
              cornerSmoothing: 1,
              gradient: {
                type: 'linear',
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '0%',
                stops: [
                  { offset: '0%', color: '#6366f1' },
                  { offset: '100%', color: '#ec4899' },
                ],
              },
            }}
          />

          <SectionLabel>Linear gradient — diagonal</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              cornerRadius: 36,
              cornerSmoothing: 1,
              gradient: {
                type: 'linear',
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '100%',
                stops: [
                  { offset: '0%', color: '#f59e0b' },
                  { offset: '50%', color: '#ef4444' },
                  { offset: '100%', color: '#8b5cf6' },
                ],
              },
            }}
          />

          <SectionLabel>Radial gradient</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              cornerRadius: 36,
              cornerSmoothing: 1,
              gradient: {
                type: 'radial',
                cx: '50%',
                cy: '50%',
                r: '60%',
                stops: [
                  { offset: '0%', color: '#34d399' },
                  { offset: '100%', color: '#065f46' },
                ],
              },
            }}
          />

          <SectionLabel>Gradient + stroke</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              cornerRadius: 36,
              cornerSmoothing: 1,
              strokeColor: '#ffffff',
              strokeWidth: 3,
              gradient: {
                type: 'linear',
                x1: '0%',
                y1: '0%',
                x2: '0%',
                y2: '100%',
                stops: [
                  { offset: '0%', color: '#3b82f6' },
                  { offset: '100%', color: '#1e1b4b' },
                ],
              },
            }}
          />

          <SectionLabel>Per-corner radii</SectionLabel>
          <SquircleView
            style={{ width: '100%', aspectRatio: 2 }}
            squircleParams={{
              topLeftCornerRadius: 48,
              topRightCornerRadius: 12,
              bottomRightCornerRadius: 48,
              bottomLeftCornerRadius: 12,
              cornerSmoothing: 0.8,
              gradient: {
                type: 'linear',
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '0%',
                stops: [
                  { offset: '0%', color: '#f97316' },
                  { offset: '100%', color: '#fbbf24' },
                ],
              },
            }}
          />

          <SectionLabel>Gradient button</SectionLabel>
          <SquircleView
            style={{ paddingVertical: 20, alignItems: 'center' }}
            squircleParams={{
              cornerRadius: 18,
              cornerSmoothing: 1,
              gradient: {
                type: 'linear',
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '0%',
                stops: [
                  { offset: '0%', color: '#6366f1' },
                  { offset: '100%', color: '#8b5cf6' },
                ],
              },
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
              Gradient Button
            </Text>
          </SquircleView>

          {/* ── Reanimated value-driven demos ──────────────────────────── */}
          <SectionLabel>🎬 Animated — tap to morph corners</SectionLabel>
          <MorphDemo />

          <SectionLabel>🎬 Animated — looping smoothing pulse</SectionLabel>
          <SmoothingPulseDemo />

          <SectionLabel>🎬 Animated — stroke width breathe</SectionLabel>
          <StrokeBreathDemo />

          <SectionLabel>🎬 Animated — color interpolation</SectionLabel>
          <ColorCycleDemo />

          {/* ── Layout Animation demos ─────────────────────────────────── */}
          <SectionLabel>🏗 Layout — entering / exiting (FadeInDown + ZoomOut)</SectionLabel>
          <EnterExitDemo />

          <SectionLabel>🏗 Layout — list reorder (LinearTransition)</SectionLabel>
          <ListReorderDemo />

          <SectionLabel>🏗 Layout — keyframe entrance</SectionLabel>
          <KeyframeDemo />
        </Animated.View>
      </Animated.ScrollView>
    </Animated.View>
  )
}

function SectionLabel({ children }: PropsWithChildren<{}>) {
  return (
    <Animated.Text
      layout={LT}
      style={{
        color: '#9ca3af',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: -8,
      }}
    >
      {children}
    </Animated.Text>
  )
}

// ─── Animated demo 1: tap to morph corners ────────────────────────────────────

function MorphDemo() {
  const cornerRadius = useSharedValue(8)
  const cornerSmoothing = useSharedValue(0.1)
  const [morphed, setMorphed] = useState(false)

  const toggle = useCallback(() => {
    const next = !morphed
    setMorphed(next)
    cornerRadius.value = withSpring(next ? 56 : 8, { damping: 12, stiffness: 100 })
    cornerSmoothing.value = withSpring(next ? 1 : 0.1, { damping: 14 })
  }, [morphed, cornerRadius, cornerSmoothing])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 200 }),
  }))

  return (
    <Pressable onPress={toggle} style={styles.pressable}>
      <AnimatedSquircleView
        animatedSquircleParams={{
          cornerRadius,
          cornerSmoothing,
          gradient: {
            type: 'linear',
            x1: '0%', y1: '0%', x2: '100%', y2: '100%',
            stops: [
              { offset: '0%', color: '#6366f1' },
              { offset: '100%', color: '#ec4899' },
            ],
          },
        }}
        style={[styles.animatedCard, animatedStyle]}
      >
        <Text style={styles.cardLabel}>
          {morphed ? 'Tap to sharpen ↗' : 'Tap to morph →'}
        </Text>
      </AnimatedSquircleView>
    </Pressable>
  )
}

// ─── Animated demo 2: looping smoothing pulse ─────────────────────────────────

function SmoothingPulseDemo() {
  const cornerSmoothing = useSharedValue(0)

  React.useEffect(() => {
    cornerSmoothing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1 // infinite
    )
  }, [cornerSmoothing])

  return (
    <AnimatedSquircleView
      animatedSquircleParams={{
        cornerRadius: 32,
        cornerSmoothing,
        fillColor: '#0ea5e9',
      }}
      style={styles.animatedCard}
    >
      <Text style={styles.cardLabel}>Smoothing 0 → 1 → 0</Text>
    </AnimatedSquircleView>
  )
}

// ─── Animated demo 3: stroke width breathe ────────────────────────────────────

function StrokeBreathDemo() {
  const strokeWidth = useSharedValue(0)
  const cornerRadius = useSharedValue(20)

  React.useEffect(() => {
    strokeWidth.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 900, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.cubic) })
      ),
      -1
    )
    cornerRadius.value = withRepeat(
      withSequence(
        withTiming(48, { duration: 900 }),
        withTiming(20, { duration: 900 })
      ),
      -1
    )
  }, [strokeWidth, cornerRadius])

  return (
    <AnimatedSquircleView
      animatedSquircleParams={{
        cornerRadius,
        cornerSmoothing: 0.8,
        fillColor: '#1e1b4b',
        strokeColor: '#818cf8',
        strokeWidth,
      }}
      style={styles.animatedCard}
    >
      <Text style={styles.cardLabel}>Stroke breathes in/out</Text>
    </AnimatedSquircleView>
  )
}

// ─── Animated demo 4: color interpolation ───────────────────────────────────────

function ColorCycleDemo() {
  // 0 → 1 ping-pong progress driver
  const progress = useSharedValue(0)

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      -1,   // infinite
      true, // reverse (ping-pong)
    )
  }, [progress])

  // Derive animated fill color — runs entirely on the UI thread
  const fillColor = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      ['#6366f1', '#ec4899', '#f59e0b', '#10b981'], // purple → pink → amber → green
    )
  )

  // Derive animated stroke color in sync
  const strokeColor = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      ['#818cf8', '#f9a8d4', '#fde68a', '#6ee7b7'],
    )
  )

  return (
    <AnimatedSquircleView
      animatedSquircleParams={{
        cornerRadius: 32,
        cornerSmoothing: 1,
        fillColor,    // SharedValue<string>
        strokeColor,  // SharedValue<string>
        strokeWidth: 4,
      }}
      style={styles.animatedCard}
    >
      <Text style={styles.cardLabel}>Color cycles purple → pink → amber → green</Text>
    </AnimatedSquircleView>
  )
}

// ─── Layout animation demo 1: entering / exiting ──────────────────────────────
//
// Every wrapper at every level is Animated.View with the same LT so the
// entire subtree participates in layout animation — no sibling jumps.

const ENTER_EXIT_CARDS = [
  {
    id: 'a',
    label: 'Card A — FadeInDown',
    stops: [{ offset: '0%', color: '#6366f1' }, { offset: '100%', color: '#818cf8' }] as const,
    chipColor: '#6366f1',
  },
  {
    id: 'b',
    label: 'Card B — ZoomIn',
    stops: [{ offset: '0%', color: '#ec4899' }, { offset: '100%', color: '#f43f5e' }] as const,
    chipColor: '#ec4899',
  },
  {
    id: 'c',
    label: 'Card C — BounceIn',
    stops: [{ offset: '0%', color: '#f59e0b' }, { offset: '100%', color: '#f97316' }] as const,
    chipColor: '#f59e0b',
  },
  {
    id: 'd',
    label: 'Card D — FlipInEasyX',
    stops: [{ offset: '0%', color: '#10b981' }, { offset: '100%', color: '#0ea5e9' }] as const,
    chipColor: '#10b981',
  },
]

function EnterExitDemo() {
  const [visibleIds, setVisibleIds] = useState<string[]>(
    ENTER_EXIT_CARDS.map((c) => c.id)
  )

  const toggle = (id: string) =>
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )

  const reset = () => setVisibleIds(ENTER_EXIT_CARDS.map((c) => c.id))

  const enteringMap: Record<string, any> = {
    a: FadeInDown.duration(400).springify(),
    b: ZoomIn.duration(400).springify(),
    c: BounceIn.duration(600),
    d: FlipInEasyX.duration(500),
  }
  const exitingMap: Record<string, any> = {
    a: FadeOutUp.duration(300),
    b: ZoomOut.duration(300),
    c: FadeOutUp.duration(300),
    d: FlipOutEasyX.duration(400),
  }

  return (
    // Outermost demo wrapper — participates in layout so the section below
    // it slides up smoothly when cards shrink this container.
    <Animated.View style={styles.enterExitWrapper} layout={LT}>
      {/* Toggle buttons row */}
      <Animated.View style={styles.chipRow} layout={LT}>
        {ENTER_EXIT_CARDS.map((card) => {
          const visible = visibleIds.includes(card.id)
          return (
            <Pressable
              key={card.id}
              onPress={() => toggle(card.id)}
              style={[
                styles.chip,
                { backgroundColor: visible ? card.chipColor : '#2a2a3a', borderColor: card.chipColor },
              ]}
            >
              <Text style={styles.chipLabel}>
                {visible ? '✓ ' : '+ '}{card.id.toUpperCase()}
              </Text>
            </Pressable>
          )
        })}
        <Pressable onPress={reset} style={[styles.chip, styles.resetChip]}>
          <Text style={styles.chipLabel}>Reset</Text>
        </Pressable>
      </Animated.View>

      {/* Card stack — every level carries LT so siblings animate instead of jump */}
      <Animated.View style={styles.cardStack} layout={LT}>
        {ENTER_EXIT_CARDS.map((card) =>
          visibleIds.includes(card.id) ? (
            <AnimatedSquircleView
              key={card.id}
              entering={enteringMap[card.id]}
              exiting={exitingMap[card.id]}
              layout={LT}
              animatedSquircleParams={{
                cornerRadius: 20,
                cornerSmoothing: 0.8,
                gradient: {
                  type: 'linear',
                  x1: '0%', y1: '0%', x2: '100%', y2: '0%',
                  stops: card.stops,
                },
              }}
              style={styles.layoutCard}
            >
              <Text style={styles.cardLabel}>{card.label}</Text>
            </AnimatedSquircleView>
          ) : null
        )}
      </Animated.View>
    </Animated.View>
  )
}

// ─── Layout animation demo 2: list reorder with LinearTransition ───────────────

const INITIAL_ITEMS = [
  { id: '1', label: '🚀 Rocket', fillColor: '#6366f1', strokeColor: '#818cf8' },
  { id: '2', label: '🌊 Wave', fillColor: '#0c4a6e', strokeColor: '#0ea5e9' },
  { id: '3', label: '🔥 Fire', fillColor: '#7c2d12', strokeColor: '#f97316' },
  { id: '4', label: '⚡ Thunder', fillColor: '#713f12', strokeColor: '#eab308' },
  { id: '5', label: '🌸 Bloom', fillColor: '#831843', strokeColor: '#ec4899' },
]

function ListReorderDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const shuffle = () =>
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5))

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const reset = () => setItems(INITIAL_ITEMS)

  return (
    <Animated.View style={styles.enterExitWrapper} layout={LT}>
      <Animated.View style={styles.chipRow} layout={LT}>
        <Pressable
          onPress={shuffle}
          style={[styles.chip, { backgroundColor: '#6366f1', borderColor: '#6366f1' }]}
        >
          <Text style={styles.chipLabel}>🔀 Shuffle</Text>
        </Pressable>
        <Pressable onPress={reset} style={[styles.chip, styles.resetChip]}>
          <Text style={styles.chipLabel}>Reset</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={styles.listContainer} layout={LT}>
        {items.map((item) => (
          <AnimatedSquircleView
            key={item.id}
            layout={LT}
            entering={FadeInDown.duration(300).springify()}
            exiting={FadeOutUp.duration(250)}
            animatedSquircleParams={{
              cornerRadius: 16,
              cornerSmoothing: 0.8,
              fillColor: item.fillColor,
              strokeColor: item.strokeColor,
              strokeWidth: 1.5,
            }}
            style={styles.listItem}
          >
            <Text style={[styles.listItemLabel, { color: item.strokeColor }]}>
              {item.label}
            </Text>
            <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
              <Text style={styles.removeBtn}>✕</Text>
            </Pressable>
          </AnimatedSquircleView>
        ))}
      </Animated.View>
    </Animated.View>
  )
}

// ─── Layout animation demo 3: Keyframe entrance ───────────────────────────────

const dropBounce = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -60 }, { scale: 0.6 }] },
  60: { opacity: 1, transform: [{ translateY: 10 }, { scale: 1.08 }] },
  80: { transform: [{ translateY: -6 }, { scale: 0.97 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
}).duration(700)

const spinFadeIn = new Keyframe({
  0: { opacity: 0, transform: [{ rotate: '-180deg' }, { scale: 0 }] },
  50: { opacity: 0.6, transform: [{ rotate: '-45deg' }, { scale: 0.8 }] },
  100: { opacity: 1, transform: [{ rotate: '0deg' }, { scale: 1 }] },
}).duration(600)

const KEYFRAME_CARDS = [
  {
    id: 'kf1',
    entering: dropBounce,
    label: 'Drop Bounce',
    icon: '🏀',
    gradient: {
      type: 'linear' as const,
      x1: '0%', y1: '0%', x2: '100%', y2: '100%',
      stops: [
        { offset: '0%', color: '#f97316' },
        { offset: '100%', color: '#fbbf24' },
      ],
    },
    labelColor: '#fff',
  },
  {
    id: 'kf2',
    entering: spinFadeIn,
    label: 'Spin Fade In',
    icon: '🌀',
    gradient: {
      type: 'linear' as const,
      x1: '0%', y1: '0%', x2: '100%', y2: '100%',
      stops: [
        { offset: '0%', color: '#7c3aed' },
        { offset: '100%', color: '#ec4899' },
      ],
    },
    labelColor: '#fff',
  },
]

function KeyframeDemo() {
  const [show, setShow] = useState(false)

  return (
    // Use LT when expanding (grow immediately as cards enter),
    // use LT_COLLAPSE when hiding (hold height for 360ms while exit plays, then spring).
    <Animated.View style={styles.enterExitWrapper} layout={show ? LT : LT_COLLAPSE}>
      <Pressable
        onPress={() => setShow((v) => !v)}
        style={[
          styles.chip,
          { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', alignSelf: 'flex-start' },
        ]}
      >
        <Text style={styles.chipLabel}>{show ? 'Hide cards' : 'Play keyframes ▶'}</Text>
      </Pressable>

      {show && (
        // Single exiting owner: only this Animated.View controls the group exit.
        // Individual cards must NOT have their own exiting — nested exiting props
        // on parent + children compete to intercept the same unmount, causing both
        // to cancel and the whole subtree to vanish instantly instead of animating.
        <Animated.View
          style={styles.chipRow}
          layout={LT}
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(350)}
        >
          {KEYFRAME_CARDS.map((card) => (
            <AnimatedSquircleView
              key={card.id}
              layout={LT}
              entering={card.entering}
              // ← no exiting here: parent owns the group exit
              animatedSquircleParams={{
                cornerRadius: 24,
                cornerSmoothing: 1,
                gradient: card.gradient,
              }}
              style={styles.keyframeCard}
            >
              <Text style={styles.keyframeIcon}>{card.icon}</Text>
              <Text style={[styles.cardLabel, { color: card.labelColor }]}>{card.label}</Text>
            </AnimatedSquircleView>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  )
}


// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  animatedCard: {
    width: '100%',
    aspectRatio: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Enter/exit demo
  enterExitWrapper: {
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  resetChip: {
    backgroundColor: '#2a2a3a',
    borderColor: '#4b5563',
  },
  chipLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  cardStack: {
    gap: 10,
  },
  layoutCard: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // List reorder demo
  listContainer: {
    gap: 8,
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  removeBtn: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '700',
  },

  // Keyframe demo
  keyframeCard: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  keyframeIcon: {
    fontSize: 32,
  },
})
