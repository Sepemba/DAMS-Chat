import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Clock, Plus, X, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useState } from 'react';

export default function ScheduleScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    startTime: '',
    endTime: '',
    filterLevel: 'strict',
  });
  const [error, setError] = useState('');

  const [schedules, setSchedules] = useState([
    { 
      id: 1, 
      name: 'Study Time', 
      time: '14:00 - 16:00',
      apps: ['Instagram', 'TikTok', 'YouTube'],
      filterLevel: 'strict',
      isActive: true
    },
    {
      id: 2,
      name: 'Break Time',
      time: '16:00 - 17:00',
      apps: ['WhatsApp', 'YouTube'],
      filterLevel: 'moderate',
      isActive: true
    },
    {
      id: 3,
      name: 'Evening Leisure',
      time: '19:00 - 20:00',
      apps: ['Instagram', 'YouTube'],
      filterLevel: 'relaxed',
      isActive: true
    }
  ]);

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.startTime || !newSchedule.endTime) {
      setError('Please fill in all fields');
      return;
    }

    // Premium plan allows up to 3 schedules
    if (schedules.length >= 3) {
      setError('Premium plan allows up to three daily time periods');
      return;
    }

    setSchedules([...schedules, {
      id: Date.now(),
      name: newSchedule.name,
      time: `${newSchedule.startTime} - ${newSchedule.endTime}`,
      apps: ['Instagram', 'TikTok', 'YouTube'],
      filterLevel: newSchedule.filterLevel,
      isActive: true
    }]);

    setShowAddModal(false);
    setNewSchedule({ name: '', startTime: '', endTime: '', filterLevel: 'strict' });
    setError('');
  };

  const deleteSchedule = (id: number) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const getFilterLevelColor = (level: string) => {
    switch (level) {
      case 'strict': return '#FF4444';
      case 'moderate': return '#FFA000';
      case 'relaxed': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Clock size={24} color="#4c669f" />
          <Text style={styles.headerTitle}>Premium Time Periods</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        </View>

        <View style={styles.filterLegend}>
          <Text style={styles.legendTitle}>Filter Levels:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF4444' }]} />
              <Text style={styles.legendText}>Strict</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FFA000' }]} />
              <Text style={styles.legendText}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Relaxed</Text>
            </View>
          </View>
        </View>

        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleName}>{schedule.name}</Text>
              <TouchableOpacity 
                onPress={() => deleteSchedule(schedule.id)}
                style={styles.deleteButton}
              >
                <X size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.scheduleTime}>{schedule.time}</Text>
            <View style={styles.filterLevel}>
              <AlertTriangle size={16} color={getFilterLevelColor(schedule.filterLevel)} />
              <Text style={[styles.filterText, { color: getFilterLevelColor(schedule.filterLevel) }]}>
                {schedule.filterLevel.charAt(0).toUpperCase() + schedule.filterLevel.slice(1)} Filtering
              </Text>
            </View>
            <View style={styles.appsContainer}>
              {schedule.apps.map((app) => (
                <View key={app} style={styles.appBadge}>
                  <Text style={styles.appText}>{app}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, schedule.isActive && styles.statusDotActive]} />
              <Text style={styles.statusText}>
                {schedule.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        ))}

        {schedules.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No time periods set. Add up to three daily schedules with custom filtering levels.
            </Text>
          </View>
        )}
      </ScrollView>

      {schedules.length < 3 && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Time Period</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Premium Time Period</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Schedule Name"
              value={newSchedule.name}
              onChangeText={(text) => setNewSchedule({...newSchedule, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Time (HH:MM)"
              value={newSchedule.startTime}
              onChangeText={(text) => setNewSchedule({...newSchedule, startTime: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="End Time (HH:MM)"
              value={newSchedule.endTime}
              onChangeText={(text) => setNewSchedule({...newSchedule, endTime: text})}
            />
            <View style={styles.filterSelect}>
              <Text style={styles.filterSelectLabel}>Filter Level:</Text>
              <View style={styles.filterOptions}>
                {['strict', 'moderate', 'relaxed'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterOption,
                      newSchedule.filterLevel === level && styles.filterOptionSelected,
                      { borderColor: getFilterLevelColor(level) }
                    ]}
                    onPress={() => setNewSchedule({...newSchedule, filterLevel: level})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: getFilterLevelColor(level) }
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setError('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={handleAddSchedule}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Add Schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4c669f',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  premiumText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterLegend: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    padding: 20,
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  scheduleTime: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  filterLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  appsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  appBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 5,
  },
  appText: {
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#666',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4c669f',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  filterSelect: {
    marginBottom: 15,
  },
  filterSelectLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterOption: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  filterOptionSelected: {
    backgroundColor: '#f8f8f8',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#4c669f',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  confirmButtonText: {
    color: '#fff',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 15,
  },
});