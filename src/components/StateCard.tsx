import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { StateLaw } from '../types';
import { getReciprocitySummary } from '../data/reciprocity';

interface StateCardProps {
  law: StateLaw;
  onPress: () => void;
}

function PermitBadge({ type, theme }: { type: StateLaw['permitType']; theme: Theme }) {
  const badgeColor = theme.permitType[type];
  const label =
    type === 'unrestricted'
      ? 'Unrestricted'
      : type === 'shall-issue'
      ? 'Shall-Issue'
      : type === 'may-issue'
      ? 'May-Issue'
      : 'No-Issue';

  return (
    <View style={[{ backgroundColor: badgeColor, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }]}>
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

export function StateCard({ law, onPress }: StateCardProps) {
  const { theme } = useTheme();
  const reciprocity = getReciprocitySummary(law.stateCode);
  const s = makeStyles(theme);

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.header}>
        <View>
          <Text style={s.stateName}>{law.stateName}</Text>
          <Text style={s.stateCode}>{law.stateCode}</Text>
        </View>
        <PermitBadge type={law.permitType} theme={theme} />
      </View>
      <Text style={s.summary} numberOfLines={2}>
        {law.summary}
      </Text>
      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statValue}>{reciprocity.honoredByCount}</Text>
          <Text style={s.statLabel}>States Honor</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statValue}>
            {law.permitlessCarry ? 'Yes' : 'No'}
          </Text>
          <Text style={s.statLabel}>Permitless</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statValue}>
            {law.standYourGround ? 'Yes' : 'No'}
          </Text>
          <Text style={s.statLabel}>Stand Ground</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statValue}>
            {law.magazineRestriction ?? 'None'}
          </Text>
          <Text style={s.statLabel}>Mag Limit</Text>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    stateName: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    stateCode: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    summary: {
      color: theme.textSecondary,
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
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.textMuted,
      fontSize: 10,
      marginTop: 2,
    },
  });
}
