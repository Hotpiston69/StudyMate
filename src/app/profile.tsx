import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || 'Student');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || user.displayName || 'Student');
          setEmail(data.email || user.email || '');
        }
      } catch (error) {
        console.log('Profile loading error:', error);
      }
    };

    loadProfile();
  }, [user?.uid]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Could not log out. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>My Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>StudyMate Student</Text>
        </View>

        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{name}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{email || 'Not available'}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={styles.status}>Active</Text>
          </View>
        </View>

        <View style={styles.logoutCard}>
          <Text style={styles.logoutTitle}>Logout</Text>
          <Text style={styles.logoutDescription}>
            Sign out of your StudyMate account on this device.
          </Text>

          <Button
            mode="contained"
            buttonColor="#C75B69"
            textColor="#FFFFFF"
            onPress={handleLogout}
            loading={loading}
            disabled={loading}
            style={styles.logoutButton}
            contentStyle={styles.buttonContent}
          >
            Logout
          </Button>
        </View>

        <Text style={styles.footer}>StudyMate • Your Personal Study Companion</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: '#EDE7F6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  backText: {
    color: '#6A4C93',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    flex: 1,
    marginLeft: 14,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#493568',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8DDF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#6A4C93',
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#493568',
  },
  email: {
    fontSize: 14,
    color: '#777080',
    marginTop: 6,
  },
  role: {
    color: '#8064A2',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    backgroundColor: '#F1EBFA',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#493568',
    marginBottom: 14,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
    elevation: 1,
  },
  infoRow: {
    paddingVertical: 10,
  },
  infoLabel: {
    color: '#88808F',
    fontSize: 13,
    marginBottom: 5,
  },
  infoValue: {
    color: '#493568',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: '#388E5B',
    fontWeight: '600',
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEAF4',
  },
  logoutCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    elevation: 1,
  },
  logoutTitle: {
    color: '#493568',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutDescription: {
    color: '#777080',
    fontSize: 14,
    marginTop: 7,
    marginBottom: 18,
  },
  logoutButton: {
    borderRadius: 10,
  },
  buttonContent: {
    height: 46,
  },
  footer: {
    textAlign: 'center',
    color: '#9991A3',
    fontSize: 12,
    marginTop: 28,
  },
});
