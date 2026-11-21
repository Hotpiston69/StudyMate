import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import {
  Card,
  Text
} from 'react-native-paper';

const tips = [
  {
    icon: '⏱️',
    category: 'TIME MANAGEMENT',
    title: 'Try the Pomodoro Technique',
    description:
      'Study for 25 minutes with full focus, then take a 5-minute break. Repeat the cycle.',
  },
  {
    icon: '🧘',
    category: 'TAKE BREAKS',
    title: 'Give Your Mind a Rest',
    description:
      'During breaks, stretch, walk around, drink water or relax. Avoid spending the entire break scrolling on your phone.',
  },
  {
    icon: '📝',
    category: 'REVISION',
    title: 'Revise Regularly',
    description:
      'Review what you learned after class and revisit older topics regularly instead of leaving everything until exam time.',
  },
  {
    icon: '🎯',
    category: 'PRODUCTIVITY',
    title: 'Set Small Goals',
    description:
      'Divide large chapters into smaller tasks. Completing one small goal at a time makes studying more manageable.',
  },
  {
    icon: '📵',
    category: 'CONCENTRATION',
    title: 'Reduce Distractions',
    description:
      'Keep unnecessary notifications away and choose a comfortable, quiet place to study.',
  },
  {
    icon: '💤',
    category: 'HEALTHY HABITS',
    title: 'Get Enough Sleep',
    description:
      'A good sleep routine supports memory, concentration and learning. Avoid sacrificing sleep to study.',
  },
  {
    icon: '📚',
    category: 'EXAM PREPARATION',
    title: 'Practice What You Learn',
    description:
      'Solve practice questions, explain concepts in your own words and test your understanding regularly.',
  },
];

export default function TipsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
         <Pressable
  onPress={() => router.back()}
  style={styles.backButton}
>
  <Text style={styles.backText}>← Back</Text>
</Pressable>
          <Text style={styles.heading}>Study Tips</Text>
        </View>

        <Text style={styles.subtitle}>
          Small habits can make a big difference!
        </Text>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Text style={styles.featureIcon}>💜</Text>
            <Text style={styles.featureTitle}>
              Study smarter, not harder.
            </Text>
            <Text style={styles.featureDescription}>
              Build healthy study habits, manage your time and remember
              to give yourself breaks.
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Tips to improve your study routine</Text>

        {tips.map((tip, index) => (
          <Card key={index} style={styles.tipCard}>
            <Card.Content>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <Text style={styles.category}>{tip.category}</Text>
              </View>

              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>
                {tip.description}
              </Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={styles.footer}>
          Remember: Consistency matters more than perfection. 💜
        </Text>
      </ScrollView>
    </View>
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
    marginLeft: -10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#44336F',
  },
  subtitle: {
    color: '#77718A',
    marginBottom: 22,
    marginLeft: 5,
  },
  featureCard: {
    backgroundColor: '#EDE7FA',
    borderRadius: 16,
    marginBottom: 25,
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#44336F',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#6F6587',
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#44336F',
    marginBottom: 14,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 13,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  category: {
    color: '#7962B5',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tipTitle: {
    color: '#44336F',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  tipDescription: {
    color: '#77718A',
    fontSize: 13,
    lineHeight: 21,
  },
  footer: {
    textAlign: 'center',
    color: '#7962B5',
    fontWeight: '600',
    marginTop: 15,
    lineHeight: 22,
  },
  backButton: {
  alignSelf: 'flex-start',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: '#EDE7F6',
},
backText: {
  color: '#6A4C93',
  fontSize: 16,
  fontWeight: '600',
},
});
