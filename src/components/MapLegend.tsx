import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  selectedState: string | null;
}

const defaultLegend: LegendItem[] = [
  { color: Colors.reciprocity.permitless, label: 'Permitless Carry' },
  { color: Colors.permitType['shall-issue'], label: 'Shall-Issue' },
  { color: Colors.permitType['may-issue'], label: 'May-Issue' },
  { color: Colors.permitType['no-issue'], label: 'Restrictive' },
];

const reciprocityLegend: LegendItem[] = [
  { color: Colors.reciprocity.home, label: 'Home State' },
  { color: Colors.reciprocity.full, label: 'Full Reciprocity' },
  { color: Colors.reciprocity.permitless, label: 'Permitless (No Permit Needed)' },
  { color: Colors.reciprocity.none, label: 'No Reciprocity' },
];

export function MapLegend({ selectedState }: MapLegendProps) {
  const items = selectedState ? reciprocityLegend : defaultLegend;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedState ? 'Reciprocity' : 'Permit Type'}
      </Text>
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={[styles.colorBox, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
});
