import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { stateLaws } from '../../src/data/stateLaws';
import { LawDetail } from '../../src/components/LawDetail';
import { ReciprocityList } from '../../src/components/ReciprocityList';

type Tab = 'laws' | 'reciprocity';

export default function StateDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('laws');

  const law = code ? stateLaws[code] : undefined;

  if (!law) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>State not found</Text>
      </View>
    );
  }

  const permitBadgeColor = Colors.permitType[law.permitType];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: law.stateName,
        }}
      />

      {/* State header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.stateName}>{law.stateName}</Text>
            <Text style={styles.stateCode}>{law.stateCode}</Text>
          </View>
          <View style={[styles.permitBadge, { backgroundColor: permitBadgeColor }]}>
            <Text style={styles.permitBadgeText}>
              {law.permitType.replace('-', ' ')}
            </Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          <QuickStat
            label="Concealed"
            value={law.concealedCarry === 'permitless' ? 'Permitless' : 'Permit Req.'}
            positive={law.concealedCarry === 'permitless'}
          />
          <QuickStat
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
            label="Stand Ground"
            value={law.standYourGround ? 'Yes' : 'No'}
            positive={law.standYourGround}
          />
          <QuickStat
            label="Mag Limit"
            value={law.magazineRestriction ? `${law.magazineRestriction} rds` : 'None'}
            positive={!law.magazineRestriction}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'laws' && styles.tabActive]}
          onPress={() => setActiveTab('laws')}
        >
          <Text style={[styles.tabText, activeTab === 'laws' && styles.tabTextActive]}>
            Laws & Details
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'reciprocity' && styles.tabActive]}
          onPress={() => setActiveTab('reciprocity')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'reciprocity' && styles.tabTextActive,
            ]}
          >
            Reciprocity
          </Text>
        </Pressable>
      </View>

      {/* Tab content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
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
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <View style={styles.quickStat}>
      <Text style={[styles.quickStatValue, { color: positive ? Colors.success : Colors.warning }]}>
        {value}
      </Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stateName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  stateCode: {
    color: Colors.textSecondary,
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
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickStatLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
});
