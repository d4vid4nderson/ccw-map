import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
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
  const { width, height } = useWindowDimensions();
  const isWide = width > 768;
  const { selectedState, selectState, getStateColor } = useReciprocityMap();
  const [showList, setShowList] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const handleStatePress = useCallback(
    (stateCode: string) => {
      if (selectedState === stateCode) {
        router.push(`/state/${stateCode}`);
      } else {
        selectState(stateCode);
        setPanelOpen(true);
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

  const panelWidth = isWide ? 360 : width * 0.85;
  const panelMaxHeight = isWide ? height - 100 : height * 0.6;

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      <View style={styles.mapContainer}>
        <WebMap
          selectedState={selectedState}
          onStatePress={handleStatePress}
          getStateColor={getStateColor}
        />
        <MapLegend selectedState={selectedState} />
      </View>

      {/* Floating info panel */}
      {panelOpen && (
        <View
          style={[
            styles.floatingPanel,
            {
              width: panelWidth,
              maxHeight: panelMaxHeight,
            },
          ]}
        >
          {/* Panel header */}
          <View style={styles.panelHeader}>
            <View style={styles.tabRow}>
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
            <Pressable
              onPress={() => setPanelOpen(false)}
              style={styles.closePanelButton}
            >
              <Text style={styles.closePanelText}>✕</Text>
            </Pressable>
          </View>

          {/* Selection bar */}
          {selectedState && (
            <View style={styles.selectionBar}>
              <Text style={styles.selectionText}>
                {codeToStateName[selectedState]} selected — tap again for
                details
              </Text>
              <Pressable
                onPress={handleClearSelection}
                style={styles.clearButton}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
          )}

          {/* Panel content */}
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
                      {
                        allStates.filter(
                          (s) => s.permitType === 'shall-issue'
                        ).length
                      }
                    </Text>
                    <Text style={styles.statBoxLabel}>Shall-Issue</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxValue}>
                      {
                        allStates.filter((s) => s.permitType === 'may-issue')
                          .length
                      }
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
      )}

      {/* Reopen panel button when closed */}
      {!panelOpen && (
        <Pressable
          style={styles.openPanelButton}
          onPress={() => setPanelOpen(true)}
        >
          <Text style={styles.openPanelIcon}>☰</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  // Floating panel
  floatingPanel: {
    position: 'absolute',
    top: 12,
    left: 12,
    bottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
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
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary,
  },
  closePanelButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  closePanelText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },

  selectionBar: {
    backgroundColor: 'rgba(74, 144, 217, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  clearButton: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  clearText: {
    color: '#333333',
    fontSize: 11,
    fontWeight: '600',
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    minWidth: '44%',
    margin: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBoxValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  statBoxLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  instructionText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Reopen button
  openPanelButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  openPanelIcon: {
    color: Colors.text,
    fontSize: 18,
  },
});
