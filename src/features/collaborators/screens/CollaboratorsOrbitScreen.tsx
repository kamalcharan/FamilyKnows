// src/features/collaborators/screens/CollaboratorsOrbitScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Image,
  StatusBar,
} from 'react-native';
import { Text } from '@rneui/themed';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- CONFIG ---
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT * 0.42;
const INNER_RADIUS = 90;
const OUTER_RADIUS = 160;

// --- MOCK DATA ---
const USER = {
  id: 'me',
  name: 'Kamal',
  avatar: 'https://i.pravatar.cc/150?u=kamal',
  role: 'Admin',
};

const FAMILY_NODES = [
  { id: '1', name: 'Priya', role: 'Spouse', avatar: 'https://i.pravatar.cc/150?u=priya', angle: 0 },
  { id: '2', name: 'Arjun', role: 'Son', avatar: 'https://i.pravatar.cc/150?u=arjun', angle: 120 },
  { id: '3', name: 'Riya', role: 'Daughter', avatar: 'https://i.pravatar.cc/150?u=riya', angle: 240 },
];

const PROVIDER_NODES = [
  { id: '4', name: 'Dr. Rao', role: 'Doctor', icon: 'doctor', color: '#10B981', angle: 45 },
  { id: '5', name: 'Mr. Shah', role: 'CA', icon: 'briefcase-account', color: '#3B82F6', angle: 135 },
  { id: '6', name: 'Adv. Mehta', role: 'Lawyer', icon: 'scale-balance', color: '#F59E0B', angle: 225 },
  { id: '7', name: 'LIC Agent', role: 'Insurer', icon: 'shield-account', color: '#8B5CF6', angle: 315 },
];

// --- COMPONENTS ---

interface OrbitNodeItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  icon?: string;
  color?: string;
  angle: number;
}

interface OrbitNodeProps {
  item: OrbitNodeItem;
  radius: number;
  angle: number;
  onPress: (item: OrbitNodeItem) => void;
  theme: any;
  isSelected: boolean;
}

// The Planet Node (Avatar/Icon)
const OrbitNode: React.FC<OrbitNodeProps> = ({ item, radius, angle, onPress, theme, isSelected }) => {
  // Convert polar to cartesian
  const radian = (angle * Math.PI) / 180;
  const x = CENTER_X + radius * Math.cos(radian);
  const y = CENTER_Y + radius * Math.sin(radian);

  // Floating Animation
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.15 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      style={[
        styles.nodeContainer,
        {
          left: x - 30,
          top: y - 30,
          transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.9}>
        <View
          style={[
            styles.nodeBubble,
            {
              backgroundColor: theme.colors.utility.primaryBackground,
              borderColor: isSelected ? theme.colors.brand.primary : 'transparent',
              borderWidth: isSelected ? 3 : 0,
              shadowColor: isSelected ? theme.colors.brand.primary : '#000',
              shadowOpacity: isSelected ? 0.5 : 0.2,
            }
          ]}
        >
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.nodeImage} />
          ) : (
            <View style={[styles.nodeIcon, { backgroundColor: item.color + '20' }]}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
          )}
        </View>
        <View style={styles.nodeLabelContainer}>
          <Text style={[styles.nodeRole, { color: 'rgba(255,255,255,0.6)' }]}>{item.role}</Text>
          <Text style={[styles.nodeName, { color: '#FFF' }]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CollaboratorsOrbitScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedNode, setSelectedNode] = useState<OrbitNodeItem | null>(null);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Rotation animation for orbits
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle rotation for orbits
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleNodePress = (node: OrbitNodeItem) => {
    setSelectedNode(node);
  };

  const renderConnectionLine = () => {
    if (!selectedNode) return null;

    const radian = (selectedNode.angle * Math.PI) / 180;
    const radius = selectedNode.avatar ? INNER_RADIUS : OUTER_RADIUS;
    const targetX = CENTER_X + radius * Math.cos(radian);
    const targetY = CENTER_Y + radius * Math.sin(radian);

    return (
      <Line
        x1={CENTER_X}
        y1={CENTER_Y}
        x2={targetX}
        y2={targetY}
        stroke={theme.colors.brand.primary}
        strokeWidth="2"
        strokeDasharray="8, 4"
        strokeLinecap="round"
      />
    );
  };

  // Glow pulse animation for center
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.3,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Starfield Background Effect */}
      <View style={styles.starfield}>
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * SCREEN_WIDTH,
                top: Math.random() * SCREEN_HEIGHT,
                opacity: 0.2 + Math.random() * 0.5,
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
              }
            ]}
          />
        ))}
      </View>

      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Circle of Trust</Text>
          <Text style={styles.headerSubtitle}>Family & Providers</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="account-plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* ORBIT VISUALIZATION */}
      <Animated.View style={[styles.orbitContainer, { opacity: fadeAnim }]}>
        {/* SVG Background Layer for Rings */}
        <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH} style={StyleSheet.absoluteFill}>
          {/* Outer Ring (Providers) - Dashed */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={OUTER_RADIUS}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            strokeDasharray="12, 8"
            fill="none"
          />
          {/* Inner Ring (Family) - Solid */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={INNER_RADIUS}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
          />
          {/* Center Glow Ring */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={35}
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="8"
            fill="none"
          />
          {/* Active Connection Line */}
          {renderConnectionLine()}
        </Svg>

        {/* Center Sun (User) with Glow */}
        <Animated.View
          style={[
            styles.centerGlow,
            {
              left: CENTER_X - 50,
              top: CENTER_Y - 50,
              transform: [{ scale: glowAnim }]
            }
          ]}
        />
        <View style={[styles.centerNode, { left: CENTER_X - 40, top: CENTER_Y - 40 }]}>
          <Image source={{ uri: USER.avatar }} style={styles.centerImage} />
          <View style={styles.meBadge}>
            <Text style={styles.meText}>ME</Text>
          </View>
        </View>

        {/* Render Family Nodes (Inner Orbit) */}
        {FAMILY_NODES.map((node) => (
          <OrbitNode
            key={node.id}
            item={node}
            radius={INNER_RADIUS}
            angle={node.angle}
            theme={theme}
            onPress={handleNodePress}
            isSelected={selectedNode?.id === node.id}
          />
        ))}

        {/* Render Provider Nodes (Outer Orbit) */}
        {PROVIDER_NODES.map((node) => (
          <OrbitNode
            key={node.id}
            item={node}
            radius={OUTER_RADIUS}
            angle={node.angle}
            theme={theme}
            onPress={handleNodePress}
            isSelected={selectedNode?.id === node.id}
          />
        ))}
      </Animated.View>

      {/* Orbit Labels */}
      <View style={styles.orbitLabels}>
        <View style={styles.labelRow}>
          <View style={[styles.labelDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
          <Text style={styles.labelText}>Inner Circle (Family)</Text>
        </View>
        <View style={styles.labelRow}>
          <View style={[styles.labelDot, { backgroundColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }]} />
          <Text style={styles.labelText}>Outer Circle (Providers)</Text>
        </View>
      </View>

      {/* BOTTOM SHEET (Selected Details) */}
      {selectedNode ? (
        <Animated.View
          style={[
            styles.bottomSheet,
            { backgroundColor: theme.colors.utility.primaryBackground }
          ]}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetAvatarContainer}>
              {selectedNode.avatar ? (
                <Image source={{ uri: selectedNode.avatar }} style={styles.sheetAvatar} />
              ) : (
                <View style={[styles.sheetIconContainer, { backgroundColor: selectedNode.color + '20' }]}>
                  <MaterialCommunityIcons name={selectedNode.icon as any} size={28} color={selectedNode.color} />
                </View>
              )}
            </View>
            <View style={styles.sheetInfo}>
              <Text style={[styles.sheetName, { color: theme.colors.utility.primaryText }]}>{selectedNode.name}</Text>
              <Text style={[styles.sheetRole, { color: theme.colors.utility.secondaryText }]}>{selectedNode.role}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedNode(null)} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color={theme.colors.utility.secondaryText} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F615' }]}>
              <MaterialCommunityIcons name="phone" size={24} color="#3B82F6" />
              <Text style={[styles.actionText, { color: '#3B82F6' }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B98115' }]}>
              <MaterialCommunityIcons name="whatsapp" size={24} color="#10B981" />
              <Text style={[styles.actionText, { color: '#10B981' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F59E0B15' }]}>
              <MaterialCommunityIcons name="key-variant" size={24} color="#F59E0B" />
              <Text style={[styles.actionText, { color: '#F59E0B' }]}>Access</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={[styles.statsRow, { borderTopColor: theme.colors.utility.secondaryText + '15' }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.utility.primaryText }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>Shared Files</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.utility.secondaryText + '20' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.utility.primaryText }]}>3</Text>
              <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>Pending</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.utility.secondaryText + '20' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.semantic.success }]}>Active</Text>
              <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>Status</Text>
            </View>
          </View>
        </Animated.View>
      ) : (
        // HINT TEXT when nothing selected
        <View style={[styles.hintContainer, { bottom: insets.bottom + 30 }]}>
          <View style={styles.hintPill}>
            <MaterialCommunityIcons name="gesture-tap" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.hintText}>Tap a person to view actions</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  starfield: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
  },
  addButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 2,
  },
  orbitContainer: {
    flex: 1,
    position: 'relative',
  },
  centerGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  centerNode: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(59,130,246,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  centerImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  meBadge: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  meText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
  },
  nodeBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  nodeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nodeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeLabelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  nodeRole: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nodeName: {
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  orbitLabels: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetAvatarContainer: {
    marginRight: 14,
  },
  sheetAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  sheetIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetInfo: {
    flex: 1,
    gap: 2,
  },
  sheetName: {
    fontSize: 20,
    fontWeight: '700',
  },
  sheetRole: {
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  hintContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  hintText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
});
