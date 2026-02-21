import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { getReciprocityStatus, reciprocityData, permitlessCarryStates } from '../data/reciprocity';
import { stateLaws } from '../data/stateLaws';
import { codeToStateName } from '../hooks/useMapbox';
import { ReciprocityStatus } from '../types';

interface ReciprocityListProps {
  stateCode: string;
}

function statusLabel(status: ReciprocityStatus): string {
  switch (status) {
    case 'full': return 'Honored';
    case 'permitless': return 'Permitless';
    case 'none': return 'Not Honored';
    case 'home': return 'Home';
    default: return status;
  }
}

export function ReciprocityList({ stateCode }: ReciprocityListProps) {
  const { theme } = useTheme();
  const allStates = Object.keys(stateLaws).filter((s) => s !== stateCode);

  const grouped = allStates.reduce(
    (acc, code) => {
      const status = getReciprocityStatus(stateCode, code);
      if (!acc[status]) acc[status] = [];
      acc[status].push(code);
      return acc;
    },
    {} as Record<ReciprocityStatus, string[]>
  );

  const sections = [
    { status: 'permitless' as ReciprocityStatus, states: grouped['permitless'] || [] },
    { status: 'full' as ReciprocityStatus, states: grouped['full'] || [] },
    { status: 'none' as ReciprocityStatus, states: grouped['none'] || [] },
  ];

  const canCarryCount =
    (grouped['permitless']?.length || 0) + (grouped['full']?.length || 0) + 1;

  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      <View style={s.summaryBar}>
        <Text style={s.summaryText}>
          Your {codeToStateName[stateCode]} permit lets you carry in{' '}
          <Text style={s.summaryHighlight}>{canCarryCount}</Text> states
        </Text>
      </View>

      {sections.map((section) =>
        section.states.length > 0 ? (
          <View key={section.status} style={s.section}>
            <View style={s.sectionHeader}>
              <View
                style={[
                  s.statusDot,
                  { backgroundColor: theme.reciprocity[section.status] || theme.textSecondary },
                ]}
              />
              <Text style={s.sectionTitle}>
                {statusLabel(section.status)} ({section.states.length})
              </Text>
            </View>
            <View style={s.stateGrid}>
              {section.states.sort().map((code) => (
                <View key={code} style={s.stateChip}>
                  <Text style={s.stateChipCode}>{code}</Text>
                  <Text style={s.stateChipName} numberOfLines={1}>
                    {codeToStateName[code]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null
      )}
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    summaryBar: {
      backgroundColor: theme.surfaceLight,
      borderRadius: 10,
      padding: 14,
      marginBottom: 16,
    },
    summaryText: {
      color: theme.text,
      fontSize: 15,
      textAlign: 'center',
    },
    summaryHighlight: {
      fontWeight: '700',
      fontSize: 18,
      color: theme.text,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
    stateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -3,
    },
    stateChip: {
      backgroundColor: theme.surface,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      margin: 3,
    },
    stateChipCode: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '700',
      marginRight: 4,
    },
    stateChipName: {
      color: theme.textMuted,
      fontSize: 10,
      maxWidth: 80,
    },
  });
}
