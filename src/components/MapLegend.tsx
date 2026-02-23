import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { codeToStateName } from '../hooks/useMapbox';

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  activeState: string | null;
  compareMode?: boolean;
  compareStateA?: string | null;
  compareStateB?: string | null;
  compareHomeColor?: string;
  compareSelectedColor?: string;
  inlineSelectedState?: string | null;
  selectedStateColor?: string;
}

export function MapLegend({
  activeState,
  compareMode,
  compareStateA,
  compareStateB,
  compareHomeColor,
  compareSelectedColor,
  inlineSelectedState,
  selectedStateColor = '#80c4ff',
}: MapLegendProps) {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  // Compare mode legend
  if (compareMode && compareStateA && compareStateB) {
    const homeColor = compareHomeColor ?? theme.reciprocity.home;
    const selectedColor = compareSelectedColor ?? theme.compare.stateB;
    const compareLegend: LegendItem[] = [
      { color: homeColor, label: `Home State (${codeToStateName[compareStateA] || compareStateA})` },
      { color: selectedColor, label: `Selected State (${codeToStateName[compareStateB] || compareStateB})` },
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

  const defaultLegend: LegendItem[] = [
    { color: theme.reciprocity.permitless, label: 'Permitless Carry' },
    { color: theme.permitType['shall-issue'], label: 'Shall-Issue' },
    { color: theme.permitType['may-issue'], label: 'May-Issue' },
    { color: theme.permitType['no-issue'], label: 'Restrictive' },
  ];

  const selectedLabel = inlineSelectedState
    ? `Selected: ${codeToStateName[inlineSelectedState] || inlineSelectedState}`
    : 'Home State';
  const selectedColor = inlineSelectedState ? selectedStateColor : theme.reciprocity.home;

  const reciprocityLegend: LegendItem[] = [
    { color: selectedColor, label: selectedLabel },
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
