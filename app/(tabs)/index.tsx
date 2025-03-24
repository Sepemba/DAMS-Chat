import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProtectionScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}>
        <Shield size={48} color="#fff" />
        <Text style={styles.headerTitle}>SafeKids Pro</Text>
        <Text style={styles.headerSubtitle}>Protection Active</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity style={styles.emergencyButton}>
          <AlertTriangle size={24} color="#ff4444" />
          <Text style={styles.emergencyText}>Emergency Block</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Threats Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2h</Text>
            <Text style={styles.statLabel}>Screen Time</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});