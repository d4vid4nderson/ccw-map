import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { codeToStateName } from '../hooks/useMapbox';
import type { KpiFilter } from '../../app/index';

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  activeState: string | null;
  compareMode?: boolean;
  compareStateA?: string | null;
  compareStateB?: string | null;
  kpiFilter?: KpiFilter;
}

const KPI_LEGEND_LABELS: Record<string, string> = {
  'permitless': 'Permitless Carry',
  'shall-issue': 'Shall-Issue',
  'may-issue': 'May-Issue',
  'red-flag': 'Red Flag Law',
};

export function MapLegend({ activeState, compareMode, compareStateA, compareStateB, kpiFilter }: MapLegendProps) {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  // Compare mode legend
  if (compareMode && compareStateA && compareStateB) {
    const compareLegend: LegendItem[] = [
      { color: theme.compare.stateA, label: codeToStateName[compareStateA] || compareStateA },
      { color: theme.compare.stateB, label: codeToStateName[compareStateB] || compareStateB },
      { color: theme.reciprocity.default, label: 'Other States' },
    ];
    return (
      <View style={s.container}>
        <Text style={s.title}>Comparing</Text>
        {compareLegend.map((item) => (
          <View key={item.label} style={s.row}>
            <View style={[s.colorBox, { backgroundColor: item.color }]} />
            <Text style={s.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  }

  // KPI filter legend
  if (kpiFilter) {
    const kpiColor = kpiFilter === 'permitless' ? theme.reciprocity.permitless
      : kpiFilter === 'shall-issue' ? theme.permitType['shall-issue']
      : kpiFilter === 'may-issue' ? theme.permitType['may-issue']
      : theme.warning;
    const kpiLegend: LegendItem[] = [
      { color: kpiColor, label: KPI_LEGEND_LABELS[kpiFilter] || kpiFilter },
      { color: theme.reciprocity.default, label: 'Other States' },
    ];
    return (
      <View style={s.container}>
        <Text style={s.title}>Highlighted</Text>
        {kpiLegend.map((item) => (
          <View key={item.label} style={s.row}>
            <View style={[s.colorBox, { backgroundColor: item.color }]} />
            <Text style={s.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  }

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
