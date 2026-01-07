import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HistoryScreen = () => {
  // Sample parking history data
  const parkingHistory = [
    {
      id: '1',
      plateNo: 'ABC-1234',
      day: '2025-04-28',
      hoursSpent: 3,
      feesPaid: '$7.50',
      paidBy: 'John Doe',
    },
    {
      id: '2',
      plateNo: 'XYZ-5678',
      day: '2025-04-27',
      hoursSpent: 5,
      feesPaid: '$12.00',
      paidBy: 'Jane Smith',
    },
    {
      id: '3',
      plateNo: 'LMN-9101',
      day: '2025-04-26',
      hoursSpent: 2,
      feesPaid: '$5.00',
      paidBy: 'Alice Johnson',
    },

    {
        id: '4',
        plateNo: 'LMN-9101',
        day: '2025-04-26',
        hoursSpent: 2,
        feesPaid: '$5.00',
        paidBy: 'Alice Johnson',
      },
      {
        id: '5',
        plateNo: 'LMN-9101',
        day: '2025-04-26',
        hoursSpent: 2,
        feesPaid: '$5.00',
        paidBy: 'Alice Johnson',
      },
  ];

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.timelineItem}>
      {/* Time Indicator */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.day}</Text>
      </View>

      {/* Timeline Line */}
      <View style={styles.timelineIndicator}>
        <Icon name="circle" size={12} color="#007BFF" />
        {index < parkingHistory.length - 1 && <View style={styles.timelineLine} />}
      </View>

      {/* History Content */}
      <View style={styles.historyContent}>
        <View style={styles.row}>
          <Icon name="car" size={16} color="#007BFF" style={styles.icon} />
          <Text style={styles.historyTitle}>Plate No: {item.plateNo}</Text>
        </View>
        <Text style={styles.historyText}>Hours Spent: {item.hoursSpent} hrs</Text>
        <Text style={styles.historyText}>Fees Paid: {item.feesPaid}</Text>
        <Text style={styles.historyText}>Paid By: {item.paidBy}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking History</Text>
      <FlatList
        data={parkingHistory}
        keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 15,
  },
  timelineLine: {
    width: 2,
    height: 50,
    backgroundColor: '#007BFF',
    marginTop: 5,
  },
  historyContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default HistoryScreen;