import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  activeState: string | null;
}

export function MapLegend({ activeState }: MapLegendProps) {
  const { theme } = useTheme();

  const defaultLegend: LegendItem[] = [
    { color: theme.reciprocity.permitless, label: 'Permitless Carry' },
    { color: theme.permitType['shall-issue'], label: 'Shall-Issue' },
    { color: theme.permitType['may-issue'], label: 'May-Issue' },
    { color: theme.permitType['no-issue'], label: 'Restrictive' },
  ];

  const reciprocityLegend: LegendItem[] = [
    { color: theme.reciprocity.home, label: 'Home State' },
    { color: theme.reciprocity.full, label: 'Full Reciprocity' },
    { color: theme.reciprocity.permitless, label: 'Permitless (No Permit Needed)' },
    { color: theme.reciprocity.none, label: 'No Reciprocity' },
  ];

  const items = activeState ? reciprocityLegend : defaultLegend;
  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      <Text style={s.title}>
        {activeState ? 'Reciprocity' : 'Permit Type'}
      </Text>
      {items.map((item) => (
        <View key={item.label} style={s.row}>
          <View style={[s.colorBox, { backgroundColor: item.color }]} />
          <Text style={s.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 24,
      right: 12,
      backgroundColor: theme.overlay,
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    title: {
      color: theme.text,
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
      color: theme.textSecondary,
      fontSize: 11,
    },
  });
}
