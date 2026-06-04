import React, { PropsWithChildren } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, ScrollView } from 'react-native'
import { SquircleView } from 'react-native-squircle-view'

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f14' }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 60,
          gap: 24,
        }}
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
      </ScrollView>
    </View>
  )
}

function SectionLabel({ children }: PropsWithChildren<{}>) {
  return (
    <Text
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
    </Text>
  )
}
