
import { useRouter } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase';

type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

export default function TasksScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      snapshot => {
        const taskList = snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
        })) as Task[];

        setTasks(taskList);
      },
      error => {
        console.log('Tasks loading error:', error);
        Alert.alert('Error', 'Could not load your tasks.');
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const addTask = async () => {
    if (!taskName.trim() || !dueDate.trim()) {
      Alert.alert('Missing details', 'Please enter a task name and due date.');
      return;
    }

    if (!user) {
      Alert.alert('Login required', 'Please log in again.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskName.trim(),
        dueDate: dueDate.trim(),
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setTaskName('');
      setDueDate('');
    } catch (error) {
      console.log('Add task error:', error);
      Alert.alert('Error', 'Could not add your task.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed,
      });
    } catch (error) {
      console.log('Update task error:', error);
      Alert.alert('Error', 'Could not update your task.');
    }
  };

  const removeTask = async (taskId: string) => {
    if (!user || deletingTaskId) return;

    setDeletingTaskId(taskId);

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Task deleted successfully:', taskId);
    } catch (error) {
      console.log('Delete task error:', error);
      Alert.alert('Error', 'Could not delete your task. Check the console for details.');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View>
            <Text style={styles.heading}>My Tasks</Text>
            <Text style={styles.subtitle}>
              Keep track of what you need to do.
            </Text>
          </View>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>Add a new task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task name"
            placeholderTextColor="#77717F"
            value={taskName}
            onChangeText={setTaskName}
          />

          <TextInput
            style={styles.input}
            placeholder="Due date (YYYY-MM-DD)"
            placeholderTextColor="#77717F"
            value={dueDate}
            onChangeText={setDueDate}
          />

          <Pressable
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={addTask}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? 'Adding...' : 'Add Task'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.taskHeadingRow}>
          <Text style={styles.sectionTitle}>Your tasks</Text>
          <Text style={styles.totalText}>
            {tasks.length} total
          </Text>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No tasks yet. Add your first task above!
            </Text>
          </View>
        ) : (
          tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Pressable
                style={[
                  styles.checkbox,
                  task.completed && styles.checkedBox,
                ]}
                onPress={() => toggleTask(task)}
              >
                {task.completed && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.taskDetails}
                onPress={() => toggleTask(task)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.completedTitle,
                  ]}
                >
                  {task.title}
                </Text>

                <Text style={styles.dueDate}>
                  Due: {task.dueDate}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.deleteButton,
                  deletingTaskId === task.id && styles.disabledButton,
                ]}
                onPress={() => removeTask(task.id)}
                disabled={deletingTaskId !== null}
              >
                <Text style={styles.deleteText}>
                  {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                </Text>
              </Pressable>
            </View>
          ))
        )}

        <Text style={styles.progressText}>
          {completedTasks} of {tasks.length} tasks completed
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 22,
    gap: 12,
  },
  backButton: {
    backgroundColor: '#EEE8F8',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
  },
  backText: {
    color: '#59417F',
    fontSize: 16,
    fontWeight: '700',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#49366F',
  },
  subtitle: {
    fontSize: 15,
    color: '#77718A',
    marginTop: 4,
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    padding: 18,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E1F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#49366F',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8C9F5',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#393342',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#7962B5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  taskHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 22,
    marginTop: 28,
  },
  totalText: {
    color: '#7962B5',
    fontSize: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8E1F0',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1.5,
    borderColor: '#7962B5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#7962B5',
    borderColor: '#7962B5',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#393342',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#99939F',
  },
  dueDate: {
    fontSize: 13,
    color: '#888194',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FCEBED',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  deleteText: {
    color: '#B54555',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    padding: 22,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyText: {
    color: '#77718A',
    fontSize: 15,
  },
  progressText: {
    textAlign: 'center',
    color: '#7962B5',
    marginTop: 12,
    marginBottom: 25,
    fontSize: 14,
  },
});
