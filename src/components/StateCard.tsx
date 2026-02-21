import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { StateLaw } from '../types';
import { getReciprocitySummary } from '../data/reciprocity';

interface StateCardProps {
  law: StateLaw;
  onPress: () => void;
}

function PermitBadge({ type }: { type: StateLaw['permitType'] }) {
  const badgeColor = Colors.permitType[type];
  const label =
    type === 'unrestricted'
      ? 'Unrestricted'
      : type === 'shall-issue'
      ? 'Shall-Issue'
      : type === 'may-issue'
      ? 'May-Issue'
      : 'No-Issue';

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function StateCard({ law, onPress }: StateCardProps) {
  const reciprocity = getReciprocitySummary(law.stateCode);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.stateName}>{law.stateName}</Text>
          <Text style={styles.stateCode}>{law.stateCode}</Text>
        </View>
        <PermitBadge type={law.permitType} />
      </View>
      <Text style={styles.summary} numberOfLines={2}>
        {law.summary}
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{reciprocity.honoredByCount}</Text>
          <Text style={styles.statLabel}>States Honor</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {law.permitlessCarry ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.statLabel}>Permitless</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {law.standYourGround ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.statLabel}>Stand Ground</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {law.magazineRestriction ?? 'None'}
          </Text>
          <Text style={styles.statLabel}>Mag Limit</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stateName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  stateCode: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
