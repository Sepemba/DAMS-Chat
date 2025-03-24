import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, TextInput, ScrollView } from 'react-native';
import { Settings, Lock, Bell, Shield, CreditCard, ChevronRight, MessageCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = () => {
    if (currentPin.length !== 4 || newPin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    setShowPinModal(false);
    setCurrentPin('');
    setNewPin('');
    setError('');
  };

  const handleSupportRequest = () => {
    if (!supportMessage.trim()) {
      setError('Please enter your message');
      return;
    }
    // Handle priority support request
    setShowSupportModal(false);
    setSupportMessage('');
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Settings size={24} color="#4c669f" />
        <Text style={styles.headerTitle}>Premium Settings</Text>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPinModal(true)}
          >
            <Lock size={20} color="#333" />
            <Text style={styles.settingText}>Change PIN Code</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingText}>Daily Report Notifications</Text>
            <Switch value={true} onValueChange={() => {}} style={styles.switch} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Protection</Text>
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingText}>Advanced Content Filter</Text>
            <Switch value={true} onValueChange={() => {}} style={styles.switch} />
          </View>
          <View style={styles.settingItem}>
            <AlertTriangle size={20} color="#333" />
            <Text style={styles.settingText}>Instant Alerts</Text>
            <Switch value={true} onValueChange={() => {}} style={styles.switch} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Support</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowSupportModal(true)}
          >
            <MessageCircle size={20} color="#333" />
            <Text style={styles.settingText}>Contact Support</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>PRIORITY</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <TouchableOpacity style={styles.settingItem}>
            <CreditCard size={20} color="#333" />
            <Text style={styles.settingText}>Current Plan</Text>
            <Text style={styles.planBadge}>€9.99/mo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showPinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change PIN Code</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Current PIN"
              value={currentPin}
              onChangeText={setCurrentPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="New PIN"
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowPinModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={handlePinChange}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Change PIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSupportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Priority Support</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your issue..."
              value={supportMessage}
              onChangeText={setSupportMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowSupportModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={handleSupportRequest}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Send Request
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#333',
  },
  switch: {
    marginLeft: 'auto',
  },
  planBadge: {
    backgroundColor: '#4c669f',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
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