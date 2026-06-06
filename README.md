<h1 align="center">react-native-squircle-view</h1>

<p align="center">
  Figma-flavored squircles for React Native — with gradient fills, stroke, per-corner radii, and smooth Reanimated animations. No native modules required.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-squircle-view"><img src="https://img.shields.io/npm/v/react-native-squircle-view.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/react-native-squircle-view"><img src="https://img.shields.io/npm/dm/react-native-squircle-view.svg" alt="npm downloads" /></a>
  <a href="https://github.com/pankajtime123/react-native-squircle-view/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
</p>

---

<p align="center">
  <img src="./squircle-demo.gif" alt="react-native-squircle-view demo" width="320" />
</p>

---

## What is a Squircle?

A **squircle** is the smooth-corner shape used throughout Apple's iOS icons, Figma, and modern design systems. Unlike `borderRadius` which creates a simple circular arc, squircles use a mathematically precise superellipse curve that blends naturally into straight edges — giving a much more premium, fluid appearance.

| Standard `borderRadius` | Squircle (`cornerSmoothing: 1`) |
|---|---|
| Abrupt arc → straight line | Smooth continuous curve |

---

## Features

- ✅ **Figma-identical squircle shapes** — powered by [`figma-squircle`](https://github.com/phamfoo/figma-squircle)
- 🎨 **Gradient fills** — linear (horizontal, vertical, diagonal) and radial
- 🖊️ **Stroke support** — inset stroke that stays inside the shape
- 🔲 **Per-corner radii** — set each corner independently
- 🎬 **Reanimated animations** — animate radius, smoothing, color, and stroke with `SharedValue`
- 🏗️ **Layout animations** — full support for `entering`, `exiting`, `layout` props
- ⚡ **No native modules** — pure JS/SVG, works with Expo Go
- 🔑 **TypeScript-first** — fully typed API

---

## Installation

```sh
npm install react-native-squircle-view react-native-svg figma-squircle
# or
yarn add react-native-squircle-view react-native-svg figma-squircle
```

> **Note:** `react-native-svg` is a required peer dependency. Follow its [installation guide](https://github.com/software-mansion/react-native-svg?tab=readme-ov-file#installation) if you haven't already.

### Optional: Animated support

To use `<AnimatedSquircleView>`, also install Reanimated:

```sh
npm install react-native-reanimated
```

Follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/).

---

## Quick Start

```tsx
import { SquircleView } from 'react-native-squircle-view';

export default function App() {
  return (
    <SquircleView
      squircleParams={{
        cornerRadius: 24,
        cornerSmoothing: 0.6,
        fillColor: '#6366f1',
      }}
      style={{ width: 200, height: 100 }}
    />
  );
}
```

---

## Usage

### Solid Fill

```tsx
import { SquircleView } from 'react-native-squircle-view';

<SquircleView
  squircleParams={{
    cornerRadius: 36,
    cornerSmoothing: 1,      // 0 = standard border-radius, 1 = fully Figma-smooth
    fillColor: '#56CDF2',
  }}
  style={{ width: '100%', aspectRatio: 2 }}
/>
```

---

### Linear Gradient

```tsx
<SquircleView
  squircleParams={{
    cornerRadius: 36,
    cornerSmoothing: 1,
    gradient: {
      type: 'linear',
      x1: '0%', y1: '0%',   // start point
      x2: '100%', y2: '0%', // end point (horizontal)
      stops: [
        { offset: '0%',   color: '#6366f1' },
        { offset: '100%', color: '#ec4899' },
      ],
    },
  }}
  style={{ width: '100%', aspectRatio: 2 }}
/>
```

**Diagonal gradient:**

```tsx
gradient: {
  type: 'linear',
  x1: '0%', y1: '0%',
  x2: '100%', y2: '100%',
  stops: [
    { offset: '0%',   color: '#f59e0b' },
    { offset: '50%',  color: '#ef4444' },
    { offset: '100%', color: '#8b5cf6' },
  ],
},
```

---

### Radial Gradient

```tsx
<SquircleView
  squircleParams={{
    cornerRadius: 36,
    cornerSmoothing: 1,
    gradient: {
      type: 'radial',
      cx: '50%', cy: '50%', // center
      r: '60%',             // radius
      stops: [
        { offset: '0%',   color: '#34d399' },
        { offset: '100%', color: '#065f46' },
      ],
    },
  }}
  style={{ width: '100%', aspectRatio: 2 }}
/>
```

---

### Stroke

```tsx
<SquircleView
  squircleParams={{
    cornerRadius: 36,
    cornerSmoothing: 1,
    fillColor: '#1e1b4b',
    strokeColor: '#ffffff',
    strokeWidth: 3,          // always rendered inside the shape
  }}
  style={{ width: '100%', aspectRatio: 2 }}
/>
```

---

### Per-Corner Radii

Each corner can have an independent radius. Omit `cornerRadius` and set individual corners:

```tsx
<SquircleView
  squircleParams={{
    topLeftCornerRadius:     48,
    topRightCornerRadius:    12,
    bottomRightCornerRadius: 48,
    bottomLeftCornerRadius:  12,
    cornerSmoothing: 0.8,
    fillColor: '#f97316',
  }}
  style={{ width: '100%', aspectRatio: 2 }}
/>
```

---

### With Children (e.g. a Button)

`<SquircleView>` is a drop-in replacement for `<View>`. Children are rendered on top of the squircle background:

```tsx
<SquircleView
  squircleParams={{
    cornerRadius: 18,
    cornerSmoothing: 1,
    gradient: {
      type: 'linear',
      x1: '0%', y1: '0%', x2: '100%', y2: '0%',
      stops: [
        { offset: '0%',   color: '#6366f1' },
        { offset: '100%', color: '#8b5cf6' },
      ],
    },
  }}
  style={{ paddingVertical: 20, alignItems: 'center' }}
>
  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
    Gradient Button
  </Text>
</SquircleView>
```

---

## Animated API

> Requires `react-native-reanimated ≥ 3.0.0`

Use `<AnimatedSquircleView>` to animate any numeric squircle parameter with a `SharedValue`. The shape updates every frame — no JS-thread involvement after mount.

### Tap to Morph Corners

```tsx
import { AnimatedSquircleView } from 'react-native-squircle-view';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

function MorphButton() {
  const cornerRadius    = useSharedValue(8);
  const cornerSmoothing = useSharedValue(0.1);

  const toggle = () => {
    cornerRadius.value    = withSpring(56, { damping: 12, stiffness: 100 });
    cornerSmoothing.value = withSpring(1,  { damping: 14 });
  };

  return (
    <Pressable onPress={toggle}>
      <AnimatedSquircleView
        animatedSquircleParams={{
          cornerRadius,       // ← pass SharedValue directly
          cornerSmoothing,    // ← pass SharedValue directly
          fillColor: '#6366f1',
        }}
        style={{ width: 200, height: 100 }}
      />
    </Pressable>
  );
}
```

### Looping Pulse

```tsx
import { withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

function PulseDemo() {
  const cornerSmoothing = useSharedValue(0);

  useEffect(() => {
    cornerSmoothing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1, // infinite
    );
  }, []);

  return (
    <AnimatedSquircleView
      animatedSquircleParams={{
        cornerRadius: 32,
        cornerSmoothing,       // ← animates 0 → 1 → 0 in a loop
        fillColor: '#0ea5e9',
      }}
      style={{ width: 200, height: 100 }}
    />
  );
}
```

### Animated Stroke

```tsx
function StrokeBreath() {
  const strokeWidth  = useSharedValue(0);
  const cornerRadius = useSharedValue(20);

  useEffect(() => {
    strokeWidth.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 900 }),
        withTiming(1,  { duration: 900 }),
      ),
      -1,
    );
  }, []);

  return (
    <AnimatedSquircleView
      animatedSquircleParams={{
        cornerRadius: 32,
        cornerSmoothing: 0.8,
        fillColor: '#1e1b4b',
        strokeColor: '#818cf8',
        strokeWidth,            // ← animates stroke width
      }}
      style={{ width: 200, height: 100 }}
    />
  );
}
```

---

### Layout Animations

`<AnimatedSquircleView>` accepts `entering`, `exiting`, and `layout` props from Reanimated — exactly like `<Animated.View>`:

```tsx
import { FadeInDown, ZoomOut, LinearTransition } from 'react-native-reanimated';

<AnimatedSquircleView
  entering={FadeInDown.duration(400).springify()}
  exiting={ZoomOut.duration(300)}
  layout={LinearTransition.springify()}
  animatedSquircleParams={{
    cornerRadius: 20,
    cornerSmoothing: 0.8,
    fillColor: '#6366f1',
  }}
  style={{ width: '100%', height: 64 }}
>
  <Text style={{ color: '#fff' }}>I animate in and out!</Text>
</AnimatedSquircleView>
```

---

## Advanced: Custom SVG Worklet

For advanced use-cases where you need the squircle SVG path inside your own `useAnimatedProps`:

```tsx
import { getSvgPathWorklet } from 'react-native-squircle-view';
import { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import AnimatedPath from 'react-native-svg/src/elements/Path';  // re-export from your app

function MyCustomShape() {
  const cornerRadius = useSharedValue(16);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    return {
      d: getSvgPathWorklet({
        width: 200,
        height: 100,
        cornerRadius: cornerRadius.value,
        cornerSmoothing: 0.6,
      }),
    };
  });

  return <AnimatedPath animatedProps={animatedProps} fill="#6366f1" />;
}
```

---

## API Reference

### `<SquircleView>`

A drop-in replacement for React Native's `<View>`. Accepts all standard `ViewProps` plus:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `squircleParams` | `SquircleParams` | ✅ | Shape, fill, gradient, and stroke configuration |

---

### `<AnimatedSquircleView>`

Like `<SquircleView>` but accepts `SharedValue<number>` for any numeric field. Also accepts Reanimated's `entering`, `exiting`, `layout`, and `style` (with `useAnimatedStyle`).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `animatedSquircleParams` | `AnimatedSquircleParams` | ✅ | Shape params where numeric fields can be `SharedValue<number>` |

---

### `SquircleParams`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cornerRadius` | `number` | `0` | Uniform corner radius for all four corners |
| `topLeftCornerRadius` | `number` | — | Overrides top-left corner (takes priority over `cornerRadius`) |
| `topRightCornerRadius` | `number` | — | Overrides top-right corner |
| `bottomRightCornerRadius` | `number` | — | Overrides bottom-right corner |
| `bottomLeftCornerRadius` | `number` | — | Overrides bottom-left corner |
| `cornerSmoothing` | `number` | **required** | `0` = standard arc, `1` = fully Figma-smooth superellipse |
| `fillColor` | `ColorValue` | `undefined` | Solid fill color. Ignored when `gradient` is set |
| `gradient` | `GradientParams` | `undefined` | Gradient fill — takes priority over `fillColor` |
| `strokeColor` | `ColorValue` | `undefined` | Stroke color |
| `strokeWidth` | `number` | `0` | Stroke width (always inset — stays inside the shape) |

---

### `GradientParams`

#### Linear Gradient

```ts
{
  type: 'linear';
  x1?: string | number;  // start x, default '0%'
  y1?: string | number;  // start y, default '0%'
  x2?: string | number;  // end x,   default '100%'
  y2?: string | number;  // end y,   default '0%'
  stops: GradientStop[];
}
```

#### Radial Gradient

```ts
{
  type: 'radial';
  cx?: string | number;  // center x, default '50%'
  cy?: string | number;  // center y, default '50%'
  r?:  string | number;  // radius,   default '50%'
  fx?: string | number;  // focal x (defaults to cx)
  fy?: string | number;  // focal y (defaults to cy)
  stops: GradientStop[];
}
```

#### `GradientStop`

```ts
{
  offset: string | number;  // e.g. '0%', '50%', 1.0
  color: string;            // any CSS color string
  opacity?: number;         // 0–1, default 1
}
```

---

### `AnimatedSquircleParams`

Same as `SquircleParams` but every numeric field also accepts `SharedValue<number>`, and `fillColor` / `strokeColor` accept `SharedValue<string>`.

> **Note:** `gradient` is intentionally non-animated — `react-native-svg` does not support animating `<Stop>` props via `useAnimatedProps`.

---

### `getSvgPathWorklet(params)`

A worklet-compatible function to compute the SVG path string on the UI thread:

```ts
getSvgPathWorklet({
  width: number;
  height: number;
  cornerRadius?: number;
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
  cornerSmoothing: number;
  preserveSmoothing?: boolean;
}): string
```

---

## Peer Dependencies

| Package | Version | Required |
|---------|---------|----------|
| `react` | `*` | ✅ |
| `react-native` | `*` | ✅ |
| `react-native-svg` | `*` | ✅ |
| `react-native-reanimated` | `≥ 3.0.0` | ⚡ Only for `AnimatedSquircleView` |

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT — see [LICENSE](./LICENSE).

---

<p align="center">Made with ❤️ using <a href="https://github.com/callstack/react-native-builder-bob">create-react-native-library</a></p>
