// src/features/chat/components/widgets/OrbitWidget.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity, Image, Text } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// --- MOCK DATA FOR WIDGET ---
const NODES = [
  { id: '1', angle: 0, color: '#10B981', icon: 'doctor', name: 'Dr. Rao' },
  { id: '2', angle: 120, color: '#3B82F6', icon: 'briefcase-account', name: 'Accountant' },
  { id: '3', angle: 240, color: '#F59E0B', icon: 'scale-balance', name: 'Lawyer' },
];

const WIDGET_SIZE = 220;
const CENTER = WIDGET_SIZE / 2;
const RADIUS = 70;

interface OrbitWidgetProps {
  onExpand?: () => void;
  title?: string;
  nodeCount?: number;
}

export const OrbitWidget: React.FC<OrbitWidgetProps> = ({
  onExpand,
  title = 'Your Trusted Network',
  nodeCount = 3,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Slow rotation for "Hologram" feel
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Center pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = () => {
    if (onExpand) {
      onExpand();
    } else {
      navigation.navigate('CollaboratorsOrbit' as any);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.container}
      >
        {/* Holographic Background */}
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Animated Glow Border */}
        <Animated.View
          style={[
            styles.glowBorder,
            {
              borderColor: '#3B82F6',
              opacity: glowAnim,
            },
          ]}
        />

        {/* Label Badge */}
        <View style={[styles.badge, { backgroundColor: theme.colors.brand.primary }]}>
          <MaterialCommunityIcons name="google-circles-extended" size={12} color="#FFF" />
          <Text style={styles.badgeText}>{nodeCount}</Text>
        </View>

        {/* Rotating System */}
        <Animated.View
          style={{
            width: WIDGET_SIZE,
            height: WIDGET_SIZE,
            transform: [{ rotate: spin }],
          }}
        >
          <Svg height={WIDGET_SIZE} width={WIDGET_SIZE} style={StyleSheet.absoluteFill}>
            {/* Outer Ring */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 15}
              stroke="#3B82F6"
              strokeWidth="0.5"
              opacity="0.2"
            />

            {/* Main Orbit Ring */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="4, 4"
              opacity="0.5"
            />

            {/* Inner Ring */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS - 25}
              stroke="#3B82F6"
              strokeWidth="0.5"
              opacity="0.3"
            />

            {/* Connection Lines */}
            {NODES.map((node) => {
              const radian = (node.angle * Math.PI) / 180;
              const x = CENTER + RADIUS * Math.cos(radian);
              const y = CENTER + RADIUS * Math.sin(radian);
              return (
                <Line
                  key={`line-${node.id}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke={node.color}
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })}
          </Svg>

          {/* Orbiting Nodes */}
          {NODES.map((node) => {
            const radian = (node.angle * Math.PI) / 180;
            const x = CENTER + RADIUS * Math.cos(radian) - 16;
            const y = CENTER + RADIUS * Math.sin(radian) - 16;

            return (
              <Animated.View
                key={node.id}
                style={[
                  styles.node,
                  {
                    left: x,
                    top: y,
                    backgroundColor: node.color,
                    transform: [{ rotate: spin }], // Counter-rotate to keep icons upright
                  },
                ]}
              >
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <MaterialCommunityIcons name={node.icon as any} size={16} color="#FFF" />
                </Animated.View>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Center User (Static) */}
        <Animated.View
          style={[
            styles.centerNode,
            {
              left: CENTER - 22,
              top: CENTER - 22,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.centerGlow} />
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=kamal' }}
            style={styles.centerImage}
          />
        </Animated.View>

        {/* Title Label */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.expandHint}>
            <Text style={styles.expandText}>Tap to expand</Text>
            <MaterialCommunityIcons name="arrow-expand" size={12} color="rgba(255,255,255,0.5)" />
          </View>
        </View>

        {/* Hologram Overlay Effect (Scanlines) */}
        <View style={styles.scanlines} pointerEvents="none">
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.scanline,
                { top: i * (WIDGET_SIZE / 20) },
              ]}
            />
          ))}
        </View>

        {/* Corner Decorations */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDGET_SIZE,
    height: WIDGET_SIZE + 50,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginVertical: 10,
    alignSelf: 'flex-start',
    marginLeft: 16,
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  centerNode: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  centerGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  centerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  node: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.2)',
  },
  titleText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  expandText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  cornerTL: {
    top: 4,
    left: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 4,
    right: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 54,
    left: 4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 54,
    right: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 8,
  },
});
