import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Theme } from '../../src/constants/colors';
import { stateLaws } from '../../src/data/stateLaws';
import { LawDetail } from '../../src/components/LawDetail';
import { ReciprocityList } from '../../src/components/ReciprocityList';

type Tab = 'laws' | 'reciprocity';

export default function StateDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('laws');
  const { theme } = useTheme();

  const law = code ? stateLaws[code] : undefined;
  const s = makeStyles(theme);

  if (!law) {
    return (
      <View style={s.container}>
        <Text style={s.errorText}>State not found</Text>
      </View>
    );
  }

  const permitBadgeColor = theme.permitType[law.permitType];

  return (
    <View style={s.container}>
      <Stack.Screen
        options={{
          title: law.stateName,
        }}
      />

      {/* State header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.stateName}>{law.stateName}</Text>
            <Text style={s.stateCode}>{law.stateCode}</Text>
          </View>
          <View style={[s.permitBadge, { backgroundColor: permitBadgeColor }]}>
            <Text style={s.permitBadgeText}>
              {law.permitType.replace('-', ' ')}
            </Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={s.quickStats}>
          <QuickStat
            theme={theme}
            label="Concealed"
            value={law.concealedCarry === 'permitless' ? 'Permitless' : 'Permit Req.'}
            positive={law.concealedCarry === 'permitless'}
          />
          <QuickStat
            theme={theme}
            label="Open Carry"
            value={
              law.openCarry === 'permitless'
                ? 'Legal'
                : law.openCarry === 'prohibited'
                ? 'Prohibited'
                : 'Permit Req.'
            }
            positive={law.openCarry === 'permitless'}
          />
          <QuickStat
            theme={theme}
            label="Stand Ground"
            value={law.standYourGround ? 'Yes' : 'No'}
            positive={law.standYourGround}
          />
          <QuickStat
            theme={theme}
            label="Mag Limit"
            value={law.magazineRestriction ? `${law.magazineRestriction} rds` : 'None'}
            positive={!law.magazineRestriction}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        <Pressable
          style={[s.tab, activeTab === 'laws' && s.tabActive]}
          onPress={() => setActiveTab('laws')}
        >
          <Text style={[s.tabText, activeTab === 'laws' && s.tabTextActive]}>
            Laws & Details
          </Text>
        </Pressable>
        <Pressable
          style={[s.tab, activeTab === 'reciprocity' && s.tabActive]}
          onPress={() => setActiveTab('reciprocity')}
        >
          <Text
            style={[
              s.tabText,
              activeTab === 'reciprocity' && s.tabTextActive,
            ]}
          >
            Reciprocity
          </Text>
        </Pressable>
      </View>

      {/* Tab content */}
      <ScrollView
        style={s.content}
        contentContainerStyle={s.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'laws' ? (
          <LawDetail law={law} />
        ) : (
          <ReciprocityList stateCode={law.stateCode} />
        )}
      </ScrollView>
    </View>
  );
}

function QuickStat({
  label,
  value,
  positive,
  theme,
}: {
  label: string;
  value: string;
  positive: boolean;
  theme: Theme;
}) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: positive ? theme.success : theme.warning }}>
        {value}
      </Text>
      <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    errorText: {
      color: theme.error,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 40,
    },
    header: {
      backgroundColor: theme.surface,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14,
    },
    stateName: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '800',
    },
    stateCode: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    permitBadge: {
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    permitBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 13,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
    },
    tabText: {
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.primary,
    },
    content: {
      flex: 1,
    },
    contentInner: {
      padding: 16,
    },
  });
}
