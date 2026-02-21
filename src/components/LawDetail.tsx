import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { StateLaw } from '../types';

interface LawDetailProps {
  law: StateLaw;
}

function LawRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

export function LawDetail({ law }: LawDetailProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.summary}>{law.summary}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carry Laws</Text>
        <LawRow
          label="Concealed Carry"
          value={law.concealedCarry.replace('-', ' ')}
          color={law.concealedCarry === 'permitless' ? Colors.success : Colors.warning}
        />
        <LawRow
          label="Open Carry"
          value={law.openCarry.replace('-', ' ')}
          color={law.openCarry === 'permitless' ? Colors.success : law.openCarry === 'prohibited' ? Colors.error : Colors.warning}
        />
        <LawRow
          label="Permitless Carry"
          value={law.permitlessCarry ? 'Yes' : 'No'}
          color={law.permitlessCarry ? Colors.success : Colors.error}
        />
        <LawRow
          label="Permit Type"
          value={law.permitType.replace('-', ' ')}
          color={Colors.permitType[law.permitType]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Self-Defense Laws</Text>
        <LawRow
          label="Stand Your Ground"
          value={law.standYourGround ? 'Yes' : 'No'}
          color={law.standYourGround ? Colors.success : Colors.textSecondary}
        />
        <LawRow
          label="Castle Doctrine"
          value={law.castleDoctrine ? 'Yes' : 'No'}
          color={law.castleDoctrine ? Colors.success : Colors.textSecondary}
        />
        <LawRow
          label="Duty to Retreat"
          value={law.dutyToRetreat ? 'Yes' : 'No'}
          color={law.dutyToRetreat ? Colors.warning : Colors.success}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regulations</Text>
        <LawRow
          label="Magazine Limit"
          value={law.magazineRestriction ? `${law.magazineRestriction} rounds` : 'No limit'}
          color={law.magazineRestriction ? Colors.warning : Colors.success}
        />
        <LawRow
          label="Universal Background Checks"
          value={law.universalBackgroundChecks ? 'Required' : 'Not required'}
        />
        <LawRow
          label="Permit to Purchase"
          value={law.permitRequiredForPurchase ? 'Required' : 'Not required'}
        />
        <LawRow
          label="Red Flag Law"
          value={law.redFlagLaw ? 'Yes' : 'No'}
          color={law.redFlagLaw ? Colors.warning : Colors.textSecondary}
        />
        <LawRow
          label="Preemption"
          value={law.preemption ? 'Yes' : 'No'}
          color={law.preemption ? Colors.success : Colors.warning}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Provisions</Text>
        {law.keyProvisions.map((provision, index) => (
          <View key={index} style={styles.provisionRow}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.provisionText}>{provision}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.lastUpdated}>Last updated: {law.lastUpdated}</Text>
      <Text style={styles.disclaimer}>
        This information is for reference only. Laws change frequently. Always
        verify with official state sources before carrying.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.primary,
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
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  rowValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  provisionRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  bullet: {
    color: Colors.primary,
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  provisionText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  lastUpdated: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    fontStyle: 'italic',
    lineHeight: 15,
  },
});
