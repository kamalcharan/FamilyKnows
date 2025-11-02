// src/features/auth/screens/IntroScreens.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IntroScreensNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Intro'>;

interface Props {
  navigation: IntroScreensNavigationProp;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INTRO_SHOWN_KEY = '@FamilyKnows:introShown';

export const IntroScreens: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleSkip = async () => {
    await AsyncStorage.setItem(INTRO_SHOWN_KEY, 'true');
    navigation.replace('Login');
  };

  const handleNext = () => {
    if (currentPage < 2) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentPage + 1),
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  const screens = [
    {
      id: 1,
      title: "Your Family's Digital Vault",
      subtitle: "Why FamilyKnows?",
      icon: (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="shield-home" 
            size={120} 
            color={theme.colors.brand.primary} 
          />
        </View>
      ),
      points: [
        "One trusted place for everything that matters",
        "AI-powered insights to protect & grow family wealth",
        "Connect with verified service providers",
        "Share knowledge across generations"
      ],
    },
    {
      id: 2,
      title: "Encrypted Data",
      subtitle: "Your Security, Our Priority",
      icon: (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="lock-check" 
            size={120} 
            color={theme.colors.brand.primary} 
          />
        </View>
      ),
      points: [
        "End-to-end encryption for all your data",
        "Your data never leaves your control",
        "Offline-first with secure sync",
        "PIN based access to App"
      ],
    },
    {
      id: 3,
      title: "Everything Your Family Needs",
      subtitle: "Beyond Just Assets",
      icon: null,
      customContent: true,
      categories: [
        { icon: "home", label: "Property", color: '#FF6B6B' },
        { icon: "medical-bag", label: "Medical", color: '#4ECDC4' },
        { icon: "diamond-stone", label: "Valuables", color: '#45B7D1' },
        { icon: "cellphone", label: "Electronics", color: '#96CEB4' },
        { icon: "car", label: "Vehicles", color: '#FECA57' },
        { icon: "file-document", label: "Documents", color: '#9C88FF' },
      ],
    },
  ];

  const renderPagination = () => (
    <View style={styles.pagination}>
      {screens.map((_, index) => {
        const inputRange = [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: theme.colors.brand.primary,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.utility.secondaryText }]}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Screens */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(page);
        }}
        scrollEventThrottle={16}
      >
        {screens.map((screen) => (
          <View key={screen.id} style={styles.screen}>
            <View style={styles.content}>
              {screen.icon}
              
              <Text style={[styles.subtitle, { color: theme.colors.brand.primary }]}>
                {screen.subtitle}
              </Text>
              
              <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
                {screen.title}
              </Text>

              {screen.points && (
                <View style={styles.pointsContainer}>
                  {screen.points.map((point, index) => (
                    <View key={index} style={styles.pointRow}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={24} 
                        color={theme.colors.brand.tertiary} 
                      />
                      <Text style={[styles.pointText, { color: theme.colors.utility.primaryText }]}>
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {screen.categories && screen.customContent && (
                <View style={styles.wheelContainer}>
                  <View style={styles.wheelContent}>
                    {/* Spokes */}
                    {screen.categories.map((_, index) => {
                      const angle = (index * 60); // 6 items, 60 degrees apart
                      return (
                        <View
                          key={`spoke-${index}`}
                          style={[
                            styles.spokeContainer,
                            {
                              transform: [
                                { rotate: `${angle}deg` },
                              ],
                            },
                          ]}
                        >
                          <View style={[styles.spoke, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
                        </View>
                      );
                    })}

                    {/* Central hub */}
                    <View style={[styles.centralHub, { backgroundColor: theme.colors.brand.primary }]}>
                      <FontAwesome5 
                        name="infinity" 
                        size={32} 
                        color={theme.colors.utility.secondaryBackground} 
                      />
                      <Text style={[styles.hubText, { color: theme.colors.utility.secondaryBackground }]}>
                        & More
                      </Text>
                    </View>
                    
                    {/* Wheel items */}
                    {screen.categories.map((category, index) => {
                      const angle = (index * 60) - 90; // Start from top
                      const radius = 100;
                      const x = radius * Math.cos(angle * Math.PI / 180);
                      const y = radius * Math.sin(angle * Math.PI / 180);
                      
                      return (
                        <View
                          key={index}
                          style={[
                            styles.wheelItemContainer,
                            {
                              transform: [
                                { translateX: x },
                                { translateY: y },
                              ],
                            },
                          ]}
                        >
                          <View style={[styles.wheelItem, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                            <MaterialCommunityIcons
                              name={category.icon as any}
                              size={28}
                              color={category.color}
                            />
                            <Text style={[styles.wheelItemText, { color: theme.colors.utility.primaryText }]}>
                              {category.label}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  
                  {/* Bottom text */}
                  <Text style={[styles.wheelBottomText, { color: theme.colors.utility.secondaryText }]}>
                    Store anything that matters to your family
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {renderPagination()}
        
        <Button
          title={currentPage === 2 ? "Get Started" : "Next"}
          onPress={handleNext}
          buttonStyle={[
            styles.nextButton,
            { backgroundColor: theme.colors.brand.primary }
          ]}
          titleStyle={styles.nextButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  pointsContainer: {
    width: '100%',
    marginTop: 20,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  wheelContainer: {
    width: SCREEN_WIDTH - 60,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  wheelContent: {
    width: 260,
    height: 260,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralHub: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  hubText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  spokeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spoke: {
    position: 'absolute',
    width: 100,
    height: 1,
  },
  wheelItemContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  wheelItemText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  wheelBottomText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    borderRadius: 25,
    paddingVertical: 15,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});