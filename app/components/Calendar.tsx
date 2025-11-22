import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const Calendar: React.FC<{ onSelect?: (date: Date) => void }> = ({ onSelect }) => {
  const today = new Date();
  const [selected, setSelected] = useState<Date>(today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  function selectDay(day: number) {
    const date = new Date(year, month, day);
    setSelected(date);
    onSelect && onSelect(date);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMonth(month === 0 ? 11 : month - 1)}><Text style={styles.arrow}>{'<'}</Text></TouchableOpacity>
        <Text style={styles.month}>{year} - {month + 1}</Text>
        <TouchableOpacity onPress={() => setMonth(month === 11 ? 0 : month + 1)}><Text style={styles.arrow}>{'>'}</Text></TouchableOpacity>
      </View>
      <View style={styles.daysRow}>
        {days.map(d => <Text key={d} style={styles.dayName}>{d}</Text>)}
      </View>
      <View style={styles.daysGrid}>
        {Array(firstDay).fill(null).map((_, i) => <View key={'empty-' + i} style={styles.dayCell} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const isSelected = selected.getDate() === day && selected.getMonth() === month && selected.getFullYear() === year;
          return (
            <TouchableOpacity key={day} style={[styles.dayCell, isSelected && styles.selected]} onPress={() => selectDay(day)}>
              <Text style={isSelected ? styles.selectedText : styles.dayText}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#23272F', borderRadius: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  arrow: { color: '#4F8EF7', fontSize: 20, fontWeight: 'bold' },
  month: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dayName: { color: '#4F8EF7', fontWeight: 'bold', width: 32, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', margin: 2, borderRadius: 8, backgroundColor: '#181A20' },
  dayText: { color: '#fff' },
  selected: { backgroundColor: '#4F8EF7' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});

export default Calendar;
