import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '../constants/colors';
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

function statusColor(status: ReciprocityStatus): string {
  return Colors.reciprocity[status] || Colors.textSecondary;
}

export function ReciprocityList({ stateCode }: ReciprocityListProps) {
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
    (grouped['permitless']?.length || 0) + (grouped['full']?.length || 0) + 1; // +1 home

  return (
    <View style={styles.container}>
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Your {codeToStateName[stateCode]} permit lets you carry in{' '}
          <Text style={styles.summaryHighlight}>{canCarryCount}</Text> states
        </Text>
      </View>

      {sections.map((section) =>
        section.states.length > 0 ? (
          <View key={section.status} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColor(section.status) },
                ]}
              />
              <Text style={styles.sectionTitle}>
                {statusLabel(section.status)} ({section.states.length})
              </Text>
            </View>
            <View style={styles.stateGrid}>
              {section.states.sort().map((code) => (
                <View key={code} style={styles.stateChip}>
                  <Text style={styles.stateChipCode}>{code}</Text>
                  <Text style={styles.stateChipName} numberOfLines={1}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryBar: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  summaryText: {
    color: Colors.text,
    fontSize: 15,
    textAlign: 'center',
  },
  summaryHighlight: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1a1a1a',
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
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  stateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  stateChip: {
    backgroundColor: Colors.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  stateChipCode: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  stateChipName: {
    color: Colors.textMuted,
    fontSize: 10,
    maxWidth: 80,
  },
});
