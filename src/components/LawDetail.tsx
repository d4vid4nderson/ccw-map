import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { StateLaw } from '../types';

interface LawDetailProps {
  law: StateLaw;
}

function LawRow({ label, value, color, theme }: { label: string; value: string; color?: string; theme: Theme }) {
  const s = makeStyles(theme);
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

export function LawDetail({ law }: LawDetailProps) {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <Text style={s.summary}>{law.summary}</Text>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Carry Laws</Text>
        <LawRow
          theme={theme}
          label="Concealed Carry"
          value={law.concealedCarry.replace('-', ' ')}
          color={law.concealedCarry === 'permitless' ? theme.success : theme.warning}
        />
        <LawRow
          theme={theme}
          label="Open Carry"
          value={law.openCarry.replace('-', ' ')}
          color={law.openCarry === 'permitless' ? theme.success : law.openCarry === 'prohibited' ? theme.error : theme.warning}
        />
        <LawRow
          theme={theme}
          label="Permitless Carry"
          value={law.permitlessCarry ? 'Yes' : 'No'}
          color={law.permitlessCarry ? theme.success : theme.error}
        />
        <LawRow
          theme={theme}
          label="Permit Type"
          value={law.permitType.replace('-', ' ')}
          color={theme.permitType[law.permitType]}
        />
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Self-Defense Laws</Text>
        <LawRow
          theme={theme}
          label="Stand Your Ground"
          value={law.standYourGround ? 'Yes' : 'No'}
          color={law.standYourGround ? theme.success : theme.textSecondary}
        />
        <LawRow
          theme={theme}
          label="Castle Doctrine"
          value={law.castleDoctrine ? 'Yes' : 'No'}
          color={law.castleDoctrine ? theme.success : theme.textSecondary}
        />
        <LawRow
          theme={theme}
          label="Duty to Retreat"
          value={law.dutyToRetreat ? 'Yes' : 'No'}
          color={law.dutyToRetreat ? theme.warning : theme.success}
        />
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Regulations</Text>
        <LawRow
          theme={theme}
          label="Magazine Limit"
          value={law.magazineRestriction ? `${law.magazineRestriction} rounds` : 'No limit'}
          color={law.magazineRestriction ? theme.warning : theme.success}
        />
        <LawRow
          theme={theme}
          label="Universal Background Checks"
          value={law.universalBackgroundChecks ? 'Required' : 'Not required'}
        />
        <LawRow
          theme={theme}
          label="Permit to Purchase"
          value={law.permitRequiredForPurchase ? 'Required' : 'Not required'}
        />
        <LawRow
          theme={theme}
          label="Red Flag Law"
          value={law.redFlagLaw ? 'Yes' : 'No'}
          color={law.redFlagLaw ? theme.warning : theme.textSecondary}
        />
        <LawRow
          theme={theme}
          label="Preemption"
          value={law.preemption ? 'Yes' : 'No'}
          color={law.preemption ? theme.success : theme.warning}
        />
      </View>

      {(law.transportRequirements || law.ammoRestrictions) && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Transport & Storage</Text>
          {law.transportRequirements && (
            <View style={s.transportRow}>
              <Text style={s.transportLabel}>Vehicle Transport</Text>
              <Text style={s.transportText}>{law.transportRequirements}</Text>
            </View>
          )}
          {law.ammoRestrictions && (
            <View style={s.transportRow}>
              <Text style={s.transportLabel}>Ammunition</Text>
              <Text style={s.transportText}>{law.ammoRestrictions}</Text>
            </View>
          )}
        </View>
      )}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Key Provisions</Text>
        {law.keyProvisions.map((provision, index) => (
          <View key={index} style={s.provisionRow}>
            <Text style={s.bullet}>-</Text>
            <Text style={s.provisionText}>{provision}</Text>
          </View>
        ))}
      </View>

      <Text style={s.lastUpdated}>Last updated: {law.lastUpdated}</Text>

      {law.sourceUrl && (
        <Pressable
          onPress={() => {
            if (Platform.OS === 'web') {
              window.open(law.sourceUrl, '_blank');
            } else {
              Linking.openURL(law.sourceUrl);
            }
          }}
          style={s.sourceLink}
        >
          <Text style={s.sourceLinkText}>
            Official {law.stateName} Gun Laws →
          </Text>
        </Pressable>
      )}

      <Text style={s.disclaimer}>
        This information is for reference only. Laws change frequently. Always
        verify with official state sources before carrying.
      </Text>
    </ScrollView>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    summary: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 20,
    },
    section: {
      marginBottom: 20,
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    rowLabel: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    rowValue: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    transportRow: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    transportLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      marginBottom: 4,
    },
    transportText: {
      color: theme.text,
      fontSize: 13,
      lineHeight: 19,
    },
    provisionRow: {
      flexDirection: 'row',
      paddingVertical: 4,
    },
    bullet: {
      color: theme.primary,
      fontSize: 14,
      marginRight: 8,
      marginTop: 1,
    },
    provisionText: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      flex: 1,
    },
    lastUpdated: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 8,
    },
    sourceLink: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    sourceLinkText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    disclaimer: {
      color: theme.textMuted,
      fontSize: 10,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 30,
      fontStyle: 'italic',
      lineHeight: 15,
    },
  });
}
