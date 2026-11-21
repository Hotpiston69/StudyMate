import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.top}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>📚</Text>
        </View>

        <Text style={styles.brand}>StudyMate</Text>
        <Text style={styles.tagline}>YOUR PERSONAL STUDY COMPANION</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.circle}>
          <Text style={styles.heroEmoji}>🎓</Text>
          <View style={styles.smallCircle}>
            <Text style={{ fontSize: 25 }}>✨</Text>
          </View>
        </View>

        <Text style={styles.heading}>
          Study smarter,{'\n'}not harder.
        </Text>

        <Text style={styles.description}>
          Organize your tasks, plan your study sessions,
          and achieve your goals one day at a time.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Organize your tasks</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Track your progress</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Stay motivated</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Get Started  →</Text>
        </Pressable>

        <Text style={styles.footer}>
          A little progress every day adds up.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 28,
  },
  top: {
    alignItems: 'center',
    paddingTop: 25,
  },
  logo: {
    width: 72,
    height: 72,
    backgroundColor: '#6C4CE4',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
  },
  brand: {
    fontSize: 27,
    fontWeight: '800',
    color: '#292044',
    marginTop: 12,
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#8B82A9',
    marginTop: 5,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#E8DFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 85,
  },
  smallCircle: {
    position: 'absolute',
    right: 5,
    top: 15,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: '#292044',
    textAlign: 'center',
    lineHeight: 42,
  },
  description: {
    fontSize: 15,
    color: '#79718E',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 14,
    paddingHorizontal: 5,
  },
  features: {
    marginTop: 24,
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#E3DAFF',
    color: '#6C4CE4',
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#51476B',
  },
  bottom: {
    paddingBottom: 18,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6C4CE4',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    color: '#9B93B2',
    fontSize: 12,
    marginTop: 16,
  },
});
