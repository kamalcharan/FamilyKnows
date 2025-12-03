// src/features/health/screens/HealthRecordDetailScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- MOCK DATA ---
const MOCK_RECORDS: Record<string, any> = {
  'past-1': {
    id: 'past-1',
    title: "Mom's Blood Report",
    type: 'Pathology',
    date: 'Oct 28, 2024 • 10:30 AM',
    doctor: 'Dr. Rao',
    hospital: 'Apollo Diagnostics',
    summary: 'Cholesterol levels are slightly elevated. Vitamin D is low. Recommend dietary changes and supplements.',
    files: [
      { name: 'Blood_Report_Oct24.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Prescription.jpg', size: '1.1 MB', type: 'image' }
    ],
    vitals: [
      { label: 'HbA1c', value: '5.8%', status: 'normal' },
      { label: 'Cholesterol', value: '240 mg', status: 'warning' },
      { label: 'Vit D', value: '18 ng', status: 'critical' },
    ],
    nextAction: {
      title: 'Follow-up Visit',
      date: 'Nov 28, 2024',
      isScheduled: false
    }
  },
  'past-2': {
    id: 'past-2',
    title: 'Annual Dental Cleanup',
    type: 'Dental',
    date: 'Sep 15, 2024 • 3:00 PM',
    doctor: 'Dr. Smile',
    hospital: 'Dental Care Clinic',
    summary: 'Routine cleaning completed. No cavities found. Continue regular brushing and flossing.',
    files: [
      { name: 'Dental_Xray.jpg', size: '1.8 MB', type: 'image' }
    ],
    vitals: [],
    nextAction: {
      title: 'Next Cleaning',
      date: 'Mar 15, 2025',
      isScheduled: true
    }
  },
  'future-1': {
    id: 'future-1',
    title: "Dad's Diabetes Checkup",
    type: 'Consultation',
    date: 'Tomorrow • 10:00 AM',
    doctor: 'Dr. Rao',
    hospital: 'Apollo Hospitals',
    summary: 'Scheduled quarterly diabetes checkup. Bring previous reports and fasting blood sample.',
    files: [],
    vitals: [
      { label: 'Last HbA1c', value: '6.2%', status: 'warning' },
      { label: 'BP', value: '130/85', status: 'normal' },
    ],
    nextAction: {
      title: 'Appointment Confirmed',
      date: 'Tomorrow, 10:00 AM',
      isScheduled: true
    }
  },
  'future-2': {
    id: 'future-2',
    title: 'Baby Vaccination (Polio)',
    type: 'Vaccination',
    date: 'Nov 14, 2024 • 11:00 AM',
    doctor: 'Dr. Pediatrics',
    hospital: 'Apollo Clinic',
    summary: 'Scheduled OPV booster dose. Keep vaccination card handy.',
    files: [
      { name: 'Vaccination_Schedule.pdf', size: '0.5 MB', type: 'pdf' }
    ],
    vitals: [],
    nextAction: {
      title: 'Vaccination Due',
      date: 'Nov 14, 2024',
      isScheduled: true
    }
  },
  'now': {
    id: 'now',
    title: 'Family Status: Healthy',
    type: 'Overview',
    date: 'Today',
    doctor: 'Family Health Summary',
    hospital: 'FamilyKnows',
    summary: 'All family members are in good health. No pending urgent appointments or critical health alerts.',
    files: [],
    vitals: [
      { label: 'Members', value: '4', status: 'normal' },
      { label: 'Alerts', value: '0', status: 'normal' },
      { label: 'Upcoming', value: '2', status: 'normal' },
    ],
    nextAction: null
  }
};

export const HealthRecordDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  // Animation for the sheet sliding up
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get record from route params or use default
  const recordId = route.params?.recordId || 'past-1';
  const record = MOCK_RECORDS[recordId] || MOCK_RECORDS['past-1'];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return theme.colors.semantic.success;
      case 'warning': return theme.colors.semantic.warning;
      case 'critical': return theme.colors.semantic.error;
      default: return theme.colors.utility.secondaryText;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Pathology': return 'flask-outline';
      case 'Dental': return 'tooth-outline';
      case 'Consultation': return 'stethoscope';
      case 'Vaccination': return 'needle';
      case 'Overview': return 'heart-pulse';
      default: return 'file-document-outline';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch(fileType) {
      case 'pdf': return { icon: 'file-pdf-box', color: '#FF5252' };
      case 'image': return { icon: 'file-image', color: '#4CAF50' };
      default: return { icon: 'file-document', color: '#2196F3' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.accent.accent3 }]}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND HEADER */}
      <Animated.View style={[styles.headerBg, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={[styles.headerIconContainer, { marginTop: insets.top + 40 }]}>
          <View style={styles.headerIconBg}>
            <MaterialCommunityIcons name={getTypeIcon(record.type) as any} size={48} color="rgba(255,255,255,0.95)" />
          </View>
          <Text style={styles.headerDate}>{record.date}</Text>
        </View>
      </Animated.View>

      {/* SLIDING CONTENT SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.utility.primaryBackground,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: theme.colors.accent.accent3 + '20' }]}>
                <Text style={[styles.tagText, { color: theme.colors.accent.accent3 }]}>{record.type}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="hospital-building" size={14} color={theme.colors.utility.secondaryText} style={{marginRight: 4}}/>
                <Text style={[styles.tagText, { color: theme.colors.utility.secondaryText }]}>{record.hospital}</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>{record.title}</Text>
            <Text style={[styles.doctor, { color: theme.colors.utility.secondaryText }]}>
              {record.type === 'Overview' ? record.doctor : `Prescribed by ${record.doctor}`}
            </Text>
          </View>

          {/* Vitals Grid (The "Insight" part) */}
          {record.vitals && record.vitals.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Key Vitals</Text>
              <View style={styles.vitalsGrid}>
                {record.vitals.map((vital: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.vitalCard,
                      {
                        backgroundColor: theme.colors.utility.secondaryBackground,
                        borderLeftColor: getStatusColor(vital.status)
                      }
                    ]}
                  >
                    <Text style={[styles.vitalLabel, { color: theme.colors.utility.secondaryText }]}>{vital.label}</Text>
                    <Text style={[styles.vitalValue, { color: theme.colors.utility.primaryText }]}>{vital.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Doctor's Summary */}
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
            <MaterialCommunityIcons name="text-box-outline" size={24} color={theme.colors.utility.secondaryText} />
            <Text style={[styles.summaryText, { color: theme.colors.utility.primaryText }]}>
              "{record.summary}"
            </Text>
          </View>

          {/* Attachments (The "File Viewer") */}
          {record.files && record.files.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Attachments</Text>
              {record.files.map((file: any, index: number) => {
                const fileStyle = getFileIcon(file.type);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.fileCard, { borderColor: theme.colors.utility.secondaryText + '20' }]}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.fileIcon, { backgroundColor: fileStyle.color + '20' }]}>
                      <MaterialCommunityIcons name={fileStyle.icon as any} size={28} color={fileStyle.color} />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={[styles.fileName, { color: theme.colors.utility.primaryText }]}>{file.name}</Text>
                      <Text style={[styles.fileSize, { color: theme.colors.utility.secondaryText }]}>{file.size}</Text>
                    </View>
                    <TouchableOpacity style={[styles.viewButton, { backgroundColor: theme.colors.brand.primary + '15' }]}>
                      <MaterialCommunityIcons name="eye" size={20} color={theme.colors.brand.primary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* No Files Message */}
          {(!record.files || record.files.length === 0) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Attachments</Text>
              <View style={[styles.emptyFiles, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="file-plus-outline" size={32} color={theme.colors.utility.secondaryText + '60'} />
                <Text style={[styles.emptyFilesText, { color: theme.colors.utility.secondaryText }]}>
                  No files attached yet
                </Text>
                <TouchableOpacity style={[styles.addFileButton, { backgroundColor: theme.colors.brand.primary }]}>
                  <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
                  <Text style={styles.addFileButtonText}>Add File</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Next Action (Call to Action) */}
          {record.nextAction && (
            <View style={[
              styles.actionCard,
              {
                backgroundColor: record.nextAction.isScheduled
                  ? theme.colors.semantic.success + '10'
                  : theme.colors.brand.primary + '10',
                borderColor: record.nextAction.isScheduled
                  ? theme.colors.semantic.success
                  : theme.colors.brand.primary
              }
            ]}>
              <View style={styles.actionContent}>
                <Text style={[
                  styles.actionLabel,
                  { color: record.nextAction.isScheduled ? theme.colors.semantic.success : theme.colors.brand.primary }
                ]}>
                  {record.nextAction.isScheduled ? 'Scheduled' : 'Suggested Action'}
                </Text>
                <Text style={[styles.actionTitle, { color: theme.colors.utility.primaryText }]}>{record.nextAction.title}</Text>
                <Text style={[styles.actionDate, { color: theme.colors.utility.secondaryText }]}>
                  {record.nextAction.isScheduled ? '' : 'Due: '}{record.nextAction.date}
                </Text>
              </View>
              {!record.nextAction.isScheduled && (
                <TouchableOpacity style={[styles.scheduleButton, { backgroundColor: theme.colors.brand.primary }]}>
                  <Text style={styles.scheduleButtonText}>Schedule</Text>
                </TouchableOpacity>
              )}
              {record.nextAction.isScheduled && (
                <View style={[styles.scheduledBadge, { backgroundColor: theme.colors.semantic.success }]}>
                  <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                </View>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBg: {
    height: '30%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerIconContainer: {
    alignItems: 'center',
    gap: 12,
  },
  headerIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDate: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  doctor: {
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCard: {
    width: (width - 60) / 3,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  vitalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFiles: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  emptyFilesText: {
    fontSize: 14,
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginTop: 8,
  },
  addFileButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  actionContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionDate: {
    fontSize: 13,
    marginTop: 2,
  },
  scheduleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scheduleButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  scheduledBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
