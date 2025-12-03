// src/features/health/screens/HealthTimelineScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- MOCK DATA ---
const TIMELINE_DATA = [
  {
    id: 'future-1',
    type: 'future',
    title: 'Dad\'s Diabetes Checkup',
    date: 'Tomorrow, 10:00 AM',
    doctor: 'Dr. Rao',
    icon: 'calendar-clock',
    color: '#3B82F6', // Blue
  },
  {
    id: 'future-2',
    type: 'future',
    title: 'Baby Vaccination (Polio)',
    date: 'Nov 14, 2024',
    doctor: 'Apollo Clinic',
    icon: 'needle',
    color: '#8B5CF6', // Purple
  },
  {
    id: 'now',
    type: 'now',
    title: 'Family Status: Healthy',
    date: 'Today',
    icon: 'heart-pulse',
    color: '#10B981', // Emerald
  },
  {
    id: 'past-1',
    type: 'past',
    title: 'Mom\'s Blood Report',
    date: 'Oct 28, 2024',
    doctor: 'Diagnostics Lab',
    icon: 'file-document-outline',
    color: '#6B7280', // Gray
    status: 'Normal',
  },
  {
    id: 'past-2',
    type: 'past',
    title: 'Annual Dental Cleanup',
    date: 'Sep 15, 2024',
    doctor: 'Dr. Smile',
    icon: 'tooth-outline',
    color: '#6B7280',
    status: 'Completed',
  },
];

interface TimelineItemProps {
  item: typeof TIMELINE_DATA[0];
  index: number;
  theme: any;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, index, theme, isLast }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 100 * index;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  const isFuture = item.type === 'future';
  const isNow = item.type === 'now';

  return (
    <Animated.View
      style={[
        styles.timelineItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Time Column */}
      <View style={styles.timeColumn}>
        <Text style={[styles.dateText, isNow && styles.nowDateText, { color: isNow ? theme.colors.brand.primary : theme.colors.utility.secondaryText }]}>
          {item.date.split(',')[0]}
        </Text>
        {!isNow && (
           <Text style={[styles.timeText, { color: theme.colors.utility.secondaryText }]}>
             {item.date.split(',')[1] || ''}
           </Text>
        )}
      </View>

      {/* The Line & Dot */}
      <View style={styles.lineWrapper}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isNow ? theme.colors.semantic.success : item.color,
              width: isNow ? 20 : 12,
              height: isNow ? 20 : 12,
              borderRadius: isNow ? 10 : 6,
              borderWidth: isNow ? 4 : 0,
              borderColor: isNow ? '#D1FAE5' : 'transparent',
            }
          ]}
        />
        {!isLast && (
           <View style={[
             styles.verticalLine,
             {
                backgroundColor: isFuture ? 'transparent' : theme.colors.utility.secondaryText + '20',
                borderColor: isFuture ? theme.colors.utility.secondaryText + '40' : 'transparent',
                borderStyle: isFuture ? 'dashed' : 'solid',
                borderWidth: isFuture ? 1 : 0,
                width: isFuture ? 0 : 2,
             }
           ]} />
        )}
      </View>

      {/* Content Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.cardContainer,
          isNow ? { backgroundColor: theme.colors.semantic.success + '15', borderColor: theme.colors.semantic.success, borderWidth: 1 } :
          { backgroundColor: theme.colors.utility.secondaryBackground }
        ]}
      >
        <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]}>
                {item.title}
            </Text>
            {item.doctor && (
                <Text style={[styles.cardSubtitle, { color: theme.colors.utility.secondaryText }]}>
                    {item.doctor}
                </Text>
            )}
        </View>
        <View style={[styles.iconBubble, { backgroundColor: item.color + '15' }]}>
            <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HealthTimelineScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Pulse Animation for Header
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={[styles.header, { backgroundColor: theme.colors.accent.accent3, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Health Vitality</Text>
                <Text style={styles.headerSubtitle}>Family Timeline</Text>
            </View>

            <TouchableOpacity style={styles.addButton}>
                <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>

        {/* Floating Heartbeat Visual */}
        <Animated.View style={[styles.heartbeatContainer, { transform: [{ scale: pulseAnim }] }]}>
            <MaterialCommunityIcons name="heart-pulse" size={120} color="rgba(255,255,255,0.15)" />
        </Animated.View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: theme.colors.utility.secondaryText }]}>
            UPCOMING
        </Text>

        {TIMELINE_DATA.map((item, index) => (
            <TimelineItem
                key={item.id}
                item={item}
                index={index}
                theme={theme}
                isLast={index === TIMELINE_DATA.length - 1}
            />
        ))}

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Quick SOS / Emergency Button */}
      <TouchableOpacity
        style={[styles.sosButton, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
      >
          <MaterialCommunityIcons name="medical-bag" size={24} color="#FFF" />
          <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    zIndex: 2,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  heartbeatContainer: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 60, // Align with content
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 80,
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nowDateText: {
    fontWeight: '800',
  },
  timeText: {
    fontSize: 10,
    marginTop: 2,
  },
  lineWrapper: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    zIndex: 2,
    marginTop: 12,
  },
  verticalLine: {
    flex: 1,
    marginVertical: 4,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  footerSpace: {
    height: 100,
  },
  sosButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#EF4444', // Red
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    gap: 8,
  },
  sosText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
