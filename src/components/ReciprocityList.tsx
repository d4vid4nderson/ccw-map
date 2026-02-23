import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { getReciprocityStatus } from '../data/reciprocity';
import { stateLaws } from '../data/stateLaws';
import { codeToStateName } from '../hooks/useMapbox';
import { ReciprocityStatus } from '../types';

interface ReciprocityListProps {
  stateCode: string;
  onSelectCompareState?: (code: string) => void;
  selectedCompareState?: string | null;
}

type FilterKey = 'all' | 'permitless' | 'full' | 'none';

const FILTERS: { key: FilterKey; label: string; status?: ReciprocityStatus }[] = [
  { key: 'all',        label: 'All' },
  { key: 'permitless', label: 'Permitless', status: 'permitless' },
  { key: 'full',       label: 'Honored',    status: 'full' },
  { key: 'none',       label: 'Not Honored', status: 'none' },
];

export function ReciprocityList({ stateCode, onSelectCompareState, selectedCompareState }: ReciprocityListProps) {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Build a sorted map of code → status for all other states
  const stateStatuses = useMemo(() => {
    const allCodes = Object.keys(stateLaws).filter((s) => s !== stateCode);
    return allCodes
      .map((code) => ({
        code,
        name: codeToStateName[code] ?? code,
        status: getReciprocityStatus(stateCode, code),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [stateCode]);

  // Count per status
  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: stateStatuses.length, permitless: 0, full: 0, none: 0 };
    for (const s of stateStatuses) {
      if (s.status === 'permitless') c.permitless++;
      else if (s.status === 'full') c.full++;
      else if (s.status === 'none') c.none++;
    }
    return c;
  }, [stateStatuses]);

  const canCarryCount = counts.permitless + counts.full + 1; // +1 for home state

  // Filtered + sorted list
  const visible = useMemo(() => {
    if (activeFilter === 'all') return stateStatuses;
    return stateStatuses.filter((s) => s.status === activeFilter);
  }, [stateStatuses, activeFilter]);

  const statusColor = (status: ReciprocityStatus): string => {
    return theme.reciprocity[status as keyof typeof theme.reciprocity] as string
      ?? theme.textMuted;
  };

  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      {/* Summary */}
      <View style={s.summaryBar}>
        <Text style={s.summaryText}>
          Your {codeToStateName[stateCode]} permit lets you carry in{' '}
          <Text style={s.summaryHighlight}>{canCarryCount}</Text> states
        </Text>
      </View>

      {/* Filter pills */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          const dotColor = f.status ? statusColor(f.status) : theme.textSecondary;
          return (
            <Pressable
              key={f.key}
              style={[s.filterPill, isActive && { borderColor: dotColor, backgroundColor: `${dotColor}18` }]}
              onPress={() => setActiveFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={[s.filterDot, { backgroundColor: dotColor }]} />
              <Text style={[s.filterLabel, isActive && { color: dotColor }]}>
                {f.label}
              </Text>
              <Text style={[s.filterCount, isActive && { color: dotColor }]}>
                {counts[f.key]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tap hint */}
      {onSelectCompareState && (
        <Text style={s.compareTip}>Tap a state to see connection on map</Text>
      )}

      {/* Alphabetized list */}
      <View style={s.stateList}>
        {visible.map(({ code, name, status }, index) => {
          const isSelected = selectedCompareState === code;
          const dot = statusColor(status);
          const statusLabel =
            status === 'permitless' ? 'Permitless' :
            status === 'full'       ? 'Honored' :
            status === 'none'       ? 'Not Honored' :
            status === 'partial'    ? 'Partial' : status;
          return (
            <Pressable
              key={code}
              style={({ pressed }) => [
                s.stateRow,
                index > 0 && s.stateRowBorder,
                isSelected && { backgroundColor: `${dot}18` },
                pressed && !isSelected && { opacity: 0.7 },
              ]}
              onPress={() => onSelectCompareState?.(code)}
              accessibilityRole="button"
              accessibilityLabel={`Compare with ${name}`}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={[s.rowDot, { backgroundColor: dot }]} />
              <Text style={[s.rowCode, isSelected && { color: dot }]}>{code}</Text>
              <Text style={[s.rowName, isSelected && { color: dot }]} numberOfLines={1}>
                {name}
              </Text>
              <View style={[s.statusBadge, { backgroundColor: `${dot}22`, borderColor: `${dot}44` }]}>
                <Text style={[s.statusBadgeText, { color: dot }]}>{statusLabel}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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
      padding: 12,
      marginBottom: 14,
    },
    summaryText: {
      color: theme.text,
      fontSize: 14,
      textAlign: 'center',
    },
    summaryHighlight: {
      fontWeight: '700',
      fontSize: 17,
      color: theme.text,
    },

    // Filter pills row
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    filterPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 5,
    },
    filterDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    filterLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    filterCount: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '500',
    },

    compareTip: {
      color: theme.textMuted,
      fontSize: 11,
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: 10,
    },

    // State list
    stateList: {
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    stateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 11,
      gap: 10,
      backgroundColor: theme.surface,
    },
    stateRowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    rowDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      flexShrink: 0,
    },
    rowCode: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '700',
      width: 30,
      flexShrink: 0,
    },
    rowName: {
      color: theme.textSecondary,
      fontSize: 13,
      flex: 1,
    },
    statusBadge: {
      borderRadius: 5,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 2,
      flexShrink: 0,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: '700',
    },
  });
}
