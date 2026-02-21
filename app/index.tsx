import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { useReciprocityMap, codeToStateName } from '../src/hooks/useMapbox';
import { stateLaws, getAllStates } from '../src/data/stateLaws';
import { getReciprocitySummary } from '../src/data/reciprocity';
import { MapLegend } from '../src/components/MapLegend';
import { StateCard } from '../src/components/StateCard';
import { WebMap } from '../src/components/WebMap';

export default function MapScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 768;
  const { selectedState, selectState, getStateColor } = useReciprocityMap();
  const [showList, setShowList] = useState(false);

  const handleStatePress = useCallback(
    (stateCode: string) => {
      if (selectedState === stateCode) {
        // Tapped same state: navigate to detail
        router.push(`/state/${stateCode}`);
      } else {
        selectState(stateCode);
      }
    },
    [selectedState, selectState, router]
  );

  const handleClearSelection = useCallback(() => {
    selectState(null);
  }, [selectState]);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  return (
    <View style={styles.container}>
      {/* Map area */}
      <View style={[styles.mapContainer, isWide && styles.mapContainerWide]}>
        <WebMap
          selectedState={selectedState}
          onStatePress={handleStatePress}
          getStateColor={getStateColor}
        />
        <MapLegend selectedState={selectedState} />

        {/* Selection info bar */}
        {selectedState && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>
              {codeToStateName[selectedState]} selected — tap again for details
            </Text>
            <Pressable onPress={handleClearSelection} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* State list / sidebar */}
      <View style={[styles.listContainer, isWide && styles.listContainerWide]}>
        <View style={styles.listHeader}>
          <Pressable
            style={[styles.tabButton, !showList && styles.tabButtonActive]}
            onPress={() => setShowList(false)}
          >
            <Text
              style={[styles.tabText, !showList && styles.tabTextActive]}
            >
              Overview
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, showList && styles.tabButtonActive]}
            onPress={() => setShowList(true)}
          >
            <Text
              style={[styles.tabText, showList && styles.tabTextActive]}
            >
              All States
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!showList ? (
            <View>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {allStates.filter((s) => s.permitlessCarry).length}
                  </Text>
                  <Text style={styles.statBoxLabel}>Permitless Carry</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {allStates.filter((s) => s.permitType === 'shall-issue').length}
                  </Text>
                  <Text style={styles.statBoxLabel}>Shall-Issue</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {allStates.filter((s) => s.permitType === 'may-issue').length}
                  </Text>
                  <Text style={styles.statBoxLabel}>May-Issue</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {allStates.filter((s) => s.redFlagLaw).length}
                  </Text>
                  <Text style={styles.statBoxLabel}>Red Flag Laws</Text>
                </View>
              </View>

              <Text style={styles.instructionText}>
                Tap a state on the map to see reciprocity. Tap again to view
                full details and laws.
              </Text>

              {selectedState && stateLaws[selectedState] && (
                <View style={{ marginTop: 12 }}>
                  <StateCard
                    law={stateLaws[selectedState]}
                    onPress={() => router.push(`/state/${selectedState}`)}
                  />
                </View>
              )}
            </View>
          ) : (
            allStates.map((law) => (
              <StateCard
                key={law.stateCode}
                law={law}
                onPress={() => router.push(`/state/${law.stateCode}`)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    height: '55%',
    position: 'relative',
  },
  mapContainerWide: {
    height: '100%',
    width: '60%',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  listContainer: {
    height: '45%',
    backgroundColor: Colors.background,
  },
  listContainerWide: {
    height: '100%',
    width: '40%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  listHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  selectionBar: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(74, 144, 217, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 8,
  },
  clearText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '44%',
    margin: 4,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBoxValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  statBoxLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  instructionText: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
