import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { StateLaw } from '../types';
import { getReciprocityStatus } from '../data/reciprocity';

interface StateComparisonProps {
  stateA: StateLaw;
  stateB: StateLaw;
  onClose: () => void;
}

interface CompareField {
  label: string;
  valueA: string;
  valueB: string;
  isDifferent: boolean;
  warning?: string;
}

function formatCarryType(value: string): string {
  return value.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function formatBool(value: boolean, trueLabel = 'Yes', falseLabel = 'No'): string {
  return value ? trueLabel : falseLabel;
}

function formatMagLimit(value: number | null): string {
  return value ? `${value} rounds` : 'No limit';
}

function buildCompareFields(a: StateLaw, b: StateLaw): CompareField[] {
  const fields: CompareField[] = [];

  const add = (label: string, valA: string, valB: string, warning?: string) => {
    fields.push({
      label,
      valueA: valA,
      valueB: valB,
      isDifferent: valA !== valB,
      warning: valA !== valB ? warning : undefined,
    });
  };

  add(
    'Permit Type',
    formatCarryType(a.permitType),
    formatCarryType(b.permitType),
    'Different permit systems — check if your permit transfers.'
  );
  add(
    'Concealed Carry',
    formatCarryType(a.concealedCarry),
    formatCarryType(b.concealedCarry),
    'Concealed carry rules differ — verify you can legally carry.'
  );
  add(
    'Open Carry',
    formatCarryType(a.openCarry),
    formatCarryType(b.openCarry),
    'Open carry laws change across the border — could be illegal.'
  );
  add(
    'Permitless Carry',
    formatBool(a.permitlessCarry),
    formatBool(b.permitlessCarry),
    'One state requires a permit — do not assume permitless carry.'
  );
  add(
    'Stand Your Ground',
    formatBool(a.standYourGround),
    formatBool(b.standYourGround),
    'Self-defense rights differ — duty to retreat may apply.'
  );
  add(
    'Castle Doctrine',
    formatBool(a.castleDoctrine),
    formatBool(b.castleDoctrine),
  );
  add(
    'Duty to Retreat',
    formatBool(a.dutyToRetreat),
    formatBool(b.dutyToRetreat),
    'Duty to retreat applies in one state — know your obligation.'
  );
  add(
    'Magazine Limit',
    formatMagLimit(a.magazineRestriction),
    formatMagLimit(b.magazineRestriction),
    'Magazine capacity limits differ — you may need to swap magazines at the border.'
  );
  add(
    'Red Flag Law',
    formatBool(a.redFlagLaw),
    formatBool(b.redFlagLaw),
  );
  add(
    'Background Checks',
    formatBool(a.universalBackgroundChecks, 'Required', 'Not required'),
    formatBool(b.universalBackgroundChecks, 'Required', 'Not required'),
  );
  add(
    'Permit to Purchase',
    formatBool(a.permitRequiredForPurchase, 'Required', 'Not required'),
    formatBool(b.permitRequiredForPurchase, 'Required', 'Not required'),
  );
  add(
    'Preemption',
    formatBool(a.preemption),
    formatBool(b.preemption),
    'Local ordinances may apply in one state — check city/county laws.'
  );

  return fields;
}

function buildTravelWarnings(a: StateLaw, b: StateLaw): string[] {
  const warnings: string[] = [];

  // Reciprocity check
  const statusAtoB = getReciprocityStatus(a.stateCode, b.stateCode);
  const statusBtoA = getReciprocityStatus(b.stateCode, a.stateCode);

  if (statusAtoB === 'none') {
    warnings.push(
      `${b.stateName} does NOT honor ${a.stateName} permits. You cannot legally carry with a ${a.stateCode} permit in ${b.stateCode}.`
    );
  }
  if (statusBtoA === 'none') {
    warnings.push(
      `${a.stateName} does NOT honor ${b.stateName} permits. You cannot legally carry with a ${b.stateCode} permit in ${a.stateCode}.`
    );
  }

  // Permitless mismatch
  if (a.permitlessCarry && !b.permitlessCarry) {
    warnings.push(
      `${a.stateName} allows permitless carry but ${b.stateName} does not. You MUST have a valid permit to carry in ${b.stateCode}.`
    );
  } else if (!a.permitlessCarry && b.permitlessCarry) {
    warnings.push(
      `${b.stateName} allows permitless carry but ${a.stateName} does not. You MUST have a valid permit to carry in ${a.stateCode}.`
    );
  }

  // Magazine restriction
  if (a.magazineRestriction !== b.magazineRestriction) {
    const restrictedState = a.magazineRestriction
      ? a
      : b.magazineRestriction
      ? b
      : null;
    if (restrictedState && restrictedState.magazineRestriction) {
      warnings.push(
        `${restrictedState.stateName} limits magazines to ${restrictedState.magazineRestriction} rounds. Ensure compliance before crossing the border.`
      );
    }
  }

  // Duty to retreat
  if (a.dutyToRetreat !== b.dutyToRetreat) {
    const retreatState = a.dutyToRetreat ? a : b;
    warnings.push(
      `${retreatState.stateName} has a duty to retreat. Stand Your Ground does not apply — you must attempt to retreat before using force.`
    );
  }

  // Open carry mismatch
  if (a.openCarry !== b.openCarry) {
    const prohibitedState =
      a.openCarry === 'prohibited' ? a : b.openCarry === 'prohibited' ? b : null;
    if (prohibitedState) {
      warnings.push(
        `Open carry is prohibited in ${prohibitedState.stateName}. Keep your firearm concealed.`
      );
    }
  }

  // Preemption difference
  if (a.preemption && !b.preemption) {
    warnings.push(
      `${b.stateName} does not have state preemption — local cities and counties may have stricter gun laws. Research your specific destination.`
    );
  } else if (!a.preemption && b.preemption) {
    warnings.push(
      `${a.stateName} does not have state preemption — local cities and counties may have stricter gun laws. Research your specific destination.`
    );
  }

  return warnings;
}

export function StateComparison({ stateA, stateB, onClose }: StateComparisonProps) {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  const fields = buildCompareFields(stateA, stateB);
  const warnings = buildTravelWarnings(stateA, stateB);
  const differences = fields.filter((f) => f.isDifferent);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTitleRow}>
          <Text style={s.headerTitle}>Compare States</Text>
          <Pressable onPress={onClose} style={s.closeBtn}>
            <Text style={s.closeBtnText}>✕</Text>
          </Pressable>
        </View>
        <View style={s.stateLabels}>
          <View style={[s.stateLabelBox, s.stateLabelA]}>
            <Text style={s.stateLabelCode}>{stateA.stateCode}</Text>
            <Text style={s.stateLabelName}>{stateA.stateName}</Text>
          </View>
          <Text style={s.vsText}>vs</Text>
          <View style={[s.stateLabelBox, s.stateLabelB]}>
            <Text style={s.stateLabelCode}>{stateB.stateCode}</Text>
            <Text style={s.stateLabelName}>{stateB.stateName}</Text>
          </View>
        </View>
        <Text style={s.diffCount}>
          {differences.length} difference{differences.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <ScrollView
        style={s.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* Travel warnings */}
        {warnings.length > 0 && (
          <View style={s.warningsSection}>
            <Text style={s.warningSectionTitle}>Travel Warnings</Text>
            {warnings.map((warning, idx) => (
              <View key={idx} style={s.warningCard}>
                <Text style={s.warningIcon}>!</Text>
                <Text style={s.warningText}>{warning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Comparison table */}
        <View style={s.tableSection}>
          <Text style={s.tableSectionTitle}>Law Comparison</Text>

          {/* Column headers */}
          <View style={s.tableHeader}>
            <View style={s.tableColLabel} />
            <View style={s.tableColValue}>
              <Text style={s.tableHeaderText}>{stateA.stateCode}</Text>
            </View>
            <View style={s.tableColValue}>
              <Text style={s.tableHeaderText}>{stateB.stateCode}</Text>
            </View>
          </View>

          {fields.map((field) => (
            <View
              key={field.label}
              style={[s.tableRow, field.isDifferent && s.tableRowDiff]}
            >
              <View style={s.tableColLabel}>
                <Text style={s.rowLabel}>{field.label}</Text>
              </View>
              <View style={s.tableColValue}>
                <Text
                  style={[
                    s.rowValue,
                    field.isDifferent && s.rowValueDiff,
                  ]}
                >
                  {field.valueA}
                </Text>
              </View>
              <View style={s.tableColValue}>
                <Text
                  style={[
                    s.rowValue,
                    field.isDifferent && s.rowValueDiff,
                  ]}
                >
                  {field.valueB}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={s.disclaimer}>
          This comparison is for reference only. Laws change frequently.
          Always verify with official state sources before traveling.
        </Text>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 14,
      paddingTop: 4,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    stateLabels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    stateLabelBox: {
      flex: 1,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    stateLabelA: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(92, 159, 219, 0.2)'
        : 'rgba(74, 144, 217, 0.1)',
    },
    stateLabelB: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(233, 69, 96, 0.2)'
        : 'rgba(233, 69, 96, 0.1)',
    },
    stateLabelCode: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
    },
    stateLabelName: {
      color: theme.textSecondary,
      fontSize: 11,
      marginTop: 1,
    },
    vsText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
      marginHorizontal: 10,
    },
    diffCount: {
      color: theme.warning,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },

    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      padding: 14,
    },

    // Warnings
    warningsSection: {
      marginBottom: 16,
    },
    warningSectionTitle: {
      color: theme.error,
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    warningCard: {
      flexDirection: 'row',
      backgroundColor: theme.name === 'dark'
        ? 'rgba(239, 83, 80, 0.15)'
        : 'rgba(244, 67, 54, 0.08)',
      borderRadius: 8,
      padding: 10,
      marginBottom: 6,
      borderLeftWidth: 3,
      borderLeftColor: theme.error,
    },
    warningIcon: {
      color: theme.error,
      fontSize: 14,
      fontWeight: '800',
      marginRight: 8,
      marginTop: 1,
    },
    warningText: {
      color: theme.text,
      fontSize: 12,
      lineHeight: 17,
      flex: 1,
    },

    // Table
    tableSection: {
      marginBottom: 16,
    },
    tableSectionTitle: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomWidth: 2,
      borderBottomColor: theme.border,
    },
    tableColLabel: {
      flex: 1.2,
    },
    tableColValue: {
      flex: 1,
      alignItems: 'center',
    },
    tableHeaderText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '700',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      alignItems: 'center',
    },
    tableRowDiff: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(255, 167, 38, 0.1)'
        : 'rgba(255, 152, 0, 0.06)',
    },
    rowLabel: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    rowValue: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    rowValueDiff: {
      color: theme.warning,
    },

    disclaimer: {
      color: theme.textMuted,
      fontSize: 10,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 14,
      marginTop: 8,
      marginBottom: 20,
    },
  });
}
