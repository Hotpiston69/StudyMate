import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { auth, db } from '../firebase';

type StudySession = {
  id: string;
  subject: string;
  date: string;
  time: string;
  userId: string;
};

export default function PlannerScreen() {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const sessionsQuery = query(
      collection(db, 'studySessions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const loadedSessions = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as StudySession[];

        loadedSessions.sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
        );

        setSessions(loadedSessions);
      },
      (error) => {
        console.log('Planner loading error:', error);
        setSaveError('Could not load your study sessions.');
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const addSession = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Login required', 'Please log in again.');
      router.replace('/login');
      return;
    }

    if (!subject.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }

    const dateMatch = date.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!dateMatch) {
      Alert.alert('Invalid date', 'Enter the date as YYYY-MM-DD.');
      return;
    }

    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);

    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      Alert.alert('Invalid date', 'Please enter a real calendar date.');
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim())) {
      Alert.alert(
        'Invalid time',
        'Enter time in 24-hour format, for example 16:30.'
      );
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      await addDoc(collection(db, 'studySessions'), {
        subject: subject.trim(),
        date: date.trim(),
        time: time.trim(),
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setSubject('');
      setDate('');
      setTime('');

      Alert.alert('Success', 'Your study session has been saved.');
    } catch (error: any) {
      console.log('Planner save error:', error);

      const message =
        error?.message || 'Could not save your study session.';

      setSaveError(message);
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    setDeleteError('');

    try {
      await deleteDoc(doc(db, 'studySessions', sessionId));
    } catch (error: any) {
      console.log('Delete session error:', error);
      setDeleteError(
        error?.message || 'Could not delete this session.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Study Planner</Text>
        </View>
        <Text style={styles.subtitle}>
          Plan your study sessions and stay organised.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add Study Session</Text>

          <TextInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            mode="outlined"
            style={styles.input}
            outlineColor="#D8C9F0"
            activeOutlineColor="#8064A2"
          />

          <TextInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            placeholder="2026-11-25"
            style={styles.input}
            outlineColor="#D8C9F0"
            activeOutlineColor="#8064A2"
          />

          <TextInput
            label="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            mode="outlined"
            placeholder="16:30"
            style={styles.input}
            outlineColor="#D8C9F0"
            activeOutlineColor="#8064A2"
          />

          <Button
            mode="contained"
            onPress={addSession}
            loading={saving}
            disabled={saving}
            buttonColor="#8064A2"
            style={styles.addButton}
            contentStyle={styles.buttonContent}
          >
            Add Study Session
          </Button>

          {saveError ? (
            <Text style={styles.errorText}>{saveError}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>My Study Sessions</Text>

        {deleteError ? (
          <Text style={styles.deleteErrorText}>{deleteError}</Text>
        ) : null}

        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No study sessions yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Add your first session above!
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionInfo}>
                <Text style={styles.subjectText}>
                  {session.subject}
                </Text>

                <Text style={styles.detailText}>
                  Date: {session.date}
                </Text>

                <Text style={styles.detailText}>
                  Time: {session.time}
                </Text>
              </View>

              <Pressable
                onPress={() => deleteSession(session.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          ))
        )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#EDE7F6',
    marginBottom: 0,
  },
  backText: {
    color: '#6A4C93',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    flex: 1,
    marginLeft: 12,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#493568',
  },
  subtitle: {
    fontSize: 14,
    color: '#777080',
    marginTop: 6,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 28,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#493568',
    marginBottom: 15,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContent: {
    height: 48,
  },
  errorText: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 12,
  },
  deleteErrorText: {
    color: '#C62828',
    fontSize: 13,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#493568',
  },
  emptySubtext: {
    color: '#88808F',
    marginTop: 6,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  sessionInfo: {
    flex: 1,
  },
  subjectText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#493568',
    marginBottom: 7,
  },
  detailText: {
    fontSize: 14,
    color: '#777080',
    marginTop: 3,
  },
  deleteButton: {
    backgroundColor: '#FCE8E8',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginLeft: 10,
  },
  deleteText: {
    color: '#C62828',
    fontWeight: '600',
  },
});
