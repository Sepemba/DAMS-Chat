import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Activity, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ActivityScreen() {
  const activities = [
    {
      id: 1,
      type: 'block',
      app: 'TikTok',
      time: '14:30',
      reason: 'Outside allowed hours',
    },
    {
      id: 2,
      type: 'access',
      app: 'WhatsApp',
      time: '15:00',
      duration: '30min',
    },
    {
      id: 3,
      type: 'block',
      app: 'Instagram',
      time: '16:45',
      reason: 'Inappropriate content detected',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Activity size={24} color="#4c669f" />
        <Text style={styles.headerTitle}>Activity Log</Text>
      </View>

      <ScrollView style={styles.content}>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            {activity.type === 'block' ? (
              <AlertCircle size={24} color="#ff4444" />
            ) : (
              <CheckCircle size={24} color="#4CAF50" />
            )}
            <View style={styles.activityInfo}>
              <Text style={styles.appName}>{activity.app}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
              <Text style={styles.activityDetails}>
                {activity.type === 'block'
                  ? activity.reason
                  : `Used for ${activity.duration}`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4c669f',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityInfo: {
    marginLeft: 15,
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityDetails: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});