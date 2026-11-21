
import { useRouter } from 'expo-router';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase';

export default function DashboardScreen() {
  const router = useRouter();

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((item) => item.data());

        setTotalTasks(tasks.length);
        setCompletedTasks(
          tasks.filter((task) => task.completed === true).length
        );
      },
      (error) => {
        console.log('Dashboard tasks error:', error);
        Alert.alert('Error', 'Could not load dashboard statistics.');
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const openComingSoon = (feature: string) => {
    Alert.alert(feature, 'This feature is coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Student 👋</Text>
            <Text style={styles.subtitle}>
              Ready to make today count?
            </Text>
          </View>

          <Pressable
            style={styles.avatar}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.avatarText}>👤</Text>
          </Pressable>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Your daily progress</Text>
          <Text style={styles.progressNumber}>{progress}%</Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressCaption}>
            {totalTasks === 0
              ? 'A fresh day is a new opportunity!'
              : `${completedTasks} of ${totalTasks} tasks completed. Keep going!`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statNumber}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>

        <Pressable
          style={styles.quickCard}
          onPress={() => router.push('/tasks')}
        >
          <Text style={styles.quickIcon}>📋</Text>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>My Tasks</Text>
            <Text style={styles.quickSubtitle}>
              Organize your daily work
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() => router.push('/planner')}
        >
          <Text style={styles.quickIcon}>📅</Text>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Study Planner</Text>
            <Text style={styles.quickSubtitle}>
              Plan your study sessions
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() => router.push('/tips')}
        >
          <Text style={styles.quickIcon}>✨</Text>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>Study Tips</Text>
            <Text style={styles.quickSubtitle}>
              Get tips to improve your study habits
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.quickIcon}>👤</Text>
          <View style={styles.quickText}>
            <Text style={styles.quickTitle}>My Profile</Text>
            <Text style={styles.quickSubtitle}>
              View your account details
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.quote}>
          "Small steps every day lead to big achievements."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#292044',
  },
  subtitle: {
    color: '#79718E',
    fontSize: 14,
    marginTop: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E8DFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 27,
  },
  progressCard: {
    backgroundColor: '#6C4CE4',
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 22,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressNumber: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 12,
  },
  progressBackground: {
    height: 9,
    backgroundColor: '#A995F4',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  progressCaption: {
    color: '#EEE9FF',
    fontSize: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#292044',
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 27,
  },
  statNumber: {
    fontSize: 25,
    fontWeight: '800',
    color: '#6C4CE4',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#79718E',
    marginTop: 4,
  },
  quickCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 17,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  quickText: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#292044',
  },
  quickSubtitle: {
    fontSize: 12,
    color: '#8B82A9',
    marginTop: 4,
  },
  arrow: {
    color: '#6C4CE4',
    fontSize: 22,
  },
  quote: {
    textAlign: 'center',
    color: '#8B82A9',
    fontStyle: 'italic',
    marginHorizontal: 25,
    marginTop: 18,
    marginBottom: 30,
  },
});
