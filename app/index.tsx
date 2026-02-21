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
import { useTheme } from '../src/context/ThemeContext';
import { Theme } from '../src/constants/colors';
import { useReciprocityMap, codeToStateName } from '../src/hooks/useMapbox';
import { stateLaws, getAllStates } from '../src/data/stateLaws';
import { MapLegend } from '../src/components/MapLegend';
import { StateCard } from '../src/components/StateCard';
import { WebMap } from '../src/components/WebMap';
import { NavMenu } from '../src/components/NavMenu';
import { StateComparison } from '../src/components/StateComparison';

export default function MapScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { theme, homeState } = useTheme();
  const isWide = width > 768;
  const { selectedState, selectState, getStateColor } = useReciprocityMap();
  const [showList, setShowList] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareStateA, setCompareStateA] = useState<string | null>(null);
  const [compareStateB, setCompareStateB] = useState<string | null>(null);

  const exitCompareMode = useCallback(() => {
    setCompareMode(false);
    setCompareStateA(null);
    setCompareStateB(null);
  }, []);

  const handleStatePress = useCallback(
    (stateCode: string, shiftKey: boolean = false) => {
      // Shift-click: enter compare mode
      if (shiftKey && selectedState && selectedState !== stateCode) {
        setCompareStateA(selectedState);
        setCompareStateB(stateCode);
        setCompareMode(true);
        setPanelOpen(true);
        return;
      }

      // In compare mode: pick or swap second state
      if (compareMode && compareStateA && stateCode !== compareStateA) {
        setCompareStateB(stateCode);
        setPanelOpen(true);
        return;
      }

      // Normal behavior
      if (selectedState === stateCode) {
        router.push(`/state/${stateCode}`);
      } else {
        exitCompareMode();
        selectState(stateCode);
        setPanelOpen(true);
      }
    },
    [selectedState, selectState, router, compareMode, compareStateA, compareStateB, exitCompareMode]
  );

  const handleClearSelection = useCallback(() => {
    exitCompareMode();
    selectState(null);
  }, [selectState, exitCompareMode]);

  // Mobile compare: user taps "Compare" button, enters waiting-for-second-state mode
  const handleStartCompare = useCallback(() => {
    if (selectedState) {
      setCompareStateA(selectedState);
      setCompareStateB(null);
      setCompareMode(true);
    }
  }, [selectedState]);

  const handleShowMap = useCallback(() => {
    setMenuOpen(false);
    setPanelOpen(true);
    setShowList(false);
    exitCompareMode();
    if (homeState) {
      selectState(homeState);
    }
  }, [homeState, selectState, exitCompareMode]);

  const handleShowStates = useCallback(() => {
    setMenuOpen(false);
    setPanelOpen(true);
    setShowList(true);
    exitCompareMode();
  }, [exitCompareMode]);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  const panelWidth = isWide ? 380 : width * 0.88;
  const panelMaxHeight = isWide ? height - 100 : height * 0.65;
  const menuWidth = isWide ? 300 : width * 0.8;

  const isComparing =
    compareMode && compareStateA && compareStateB &&
    stateLaws[compareStateA] && stateLaws[compareStateB];

  const isWaitingForCompare = compareMode && compareStateA && !compareStateB;

  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      {/* Full-screen map */}
      <View style={s.mapContainer}>
        <WebMap
          selectedState={selectedState}
          onStatePress={handleStatePress}
          getStateColor={getStateColor}
        />
        <MapLegend selectedState={selectedState} />
      </View>

      {/* Floating info panel */}
      {panelOpen && !menuOpen && (
        <View
          style={[
            s.floatingPanel,
            {
              width: panelWidth,
              maxHeight: panelMaxHeight,
            },
          ]}
        >
          {/* Panel header */}
          <View style={s.panelHeader}>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={s.panelMenuButton}
            >
              <Text style={s.panelMenuIcon}>☰</Text>
            </Pressable>

            {!isComparing ? (
              <View style={s.tabRow}>
                <Pressable
                  style={[s.tabButton, !showList && s.tabButtonActive]}
                  onPress={() => { setShowList(false); exitCompareMode(); }}
                >
                  <Text style={[s.tabText, !showList && s.tabTextActive]}>
                    Overview
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.tabButton, showList && s.tabButtonActive]}
                  onPress={() => { setShowList(true); exitCompareMode(); }}
                >
                  <Text style={[s.tabText, showList && s.tabTextActive]}>
                    All States
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={s.tabRow}>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>
                    Comparing
                  </Text>
                </View>
              </View>
            )}

            <Pressable
              onPress={() => setPanelOpen(false)}
              style={s.closePanelButton}
            >
              <Text style={s.closePanelText}>✕</Text>
            </Pressable>
          </View>

          {/* Waiting for compare state hint */}
          {isWaitingForCompare && (
            <View style={s.compareHintBar}>
              <Text style={s.compareHintText}>
                Tap another state to compare with {codeToStateName[compareStateA!]}
              </Text>
              <Pressable onPress={exitCompareMode} style={s.clearButton}>
                <Text style={s.clearText}>Cancel</Text>
              </Pressable>
            </View>
          )}

          {/* Selection bar (normal mode) */}
          {!isComparing && !isWaitingForCompare && selectedState && (
            <View style={s.selectionBar}>
              <Text style={s.selectionText}>
                {codeToStateName[selectedState]} selected
              </Text>
              <Pressable
                onPress={handleStartCompare}
                style={s.compareButton}
              >
                <Text style={s.compareButtonText}>Compare</Text>
              </Pressable>
              <Pressable
                onPress={handleClearSelection}
                style={s.clearButton}
              >
                <Text style={s.clearText}>Clear</Text>
              </Pressable>
            </View>
          )}

          {/* Compare view */}
          {isComparing ? (
            <StateComparison
              stateA={stateLaws[compareStateA!]}
              stateB={stateLaws[compareStateB!]}
              onClose={exitCompareMode}
            />
          ) : (
            /* Normal panel content */
            <ScrollView
              style={s.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.scrollContent}
            >
              {!showList ? (
                <View>
                  <View style={s.statsGrid}>
                    <View style={s.statBox}>
                      <Text style={s.statBoxValue}>
                        {allStates.filter((st) => st.permitlessCarry).length}
                      </Text>
                      <Text style={s.statBoxLabel}>Permitless Carry</Text>
                    </View>
                    <View style={s.statBox}>
                      <Text style={s.statBoxValue}>
                        {
                          allStates.filter(
                            (st) => st.permitType === 'shall-issue'
                          ).length
                        }
                      </Text>
                      <Text style={s.statBoxLabel}>Shall-Issue</Text>
                    </View>
                    <View style={s.statBox}>
                      <Text style={s.statBoxValue}>
                        {
                          allStates.filter(
                            (st) => st.permitType === 'may-issue'
                          ).length
                        }
                      </Text>
                      <Text style={s.statBoxLabel}>May-Issue</Text>
                    </View>
                    <View style={s.statBox}>
                      <Text style={s.statBoxValue}>
                        {allStates.filter((st) => st.redFlagLaw).length}
                      </Text>
                      <Text style={s.statBoxLabel}>Red Flag Laws</Text>
                    </View>
                  </View>

                  <Text style={s.instructionText}>
                    Tap a state to see reciprocity. Shift-click a second state
                    to compare laws, or tap Compare after selecting one.
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
          )}
        </View>
      )}

      {/* Single menu button when panel is closed */}
      {!panelOpen && !menuOpen && (
        <Pressable
          style={s.floatingMenuButton}
          onPress={() => setMenuOpen(true)}
        >
          <Text style={s.floatingMenuIcon}>☰</Text>
        </Pressable>
      )}

      {/* Nav menu overlay */}
      {menuOpen && (
        <>
          <Pressable style={s.menuBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={[s.menuContainer, { width: menuWidth }]}>
            <NavMenu
              onClose={() => setMenuOpen(false)}
              onShowMap={handleShowMap}
              onShowStates={handleShowStates}
            />
          </View>
        </>
      )}
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mapContainer: {
      ...StyleSheet.absoluteFillObject,
    },

    // Nav menu
    menuBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 20,
    },
    menuContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 21,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },

    // Floating panel
    floatingPanel: {
      position: 'absolute',
      top: 12,
      left: 12,
      bottom: 12,
      backgroundColor: theme.overlayStrong,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
      zIndex: 10,
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
      borderBottomColor: theme.border,
    },
    panelMenuButton: {
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    panelMenuIcon: {
      color: theme.text,
      fontSize: 16,
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
      borderBottomColor: theme.primary,
    },
    tabText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.primary,
    },
    closePanelButton: {
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    closePanelText: {
      color: theme.textMuted,
      fontSize: 16,
      fontWeight: '600',
    },

    selectionBar: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(92, 159, 219, 0.15)'
        : 'rgba(74, 144, 217, 0.1)',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectionText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
      flex: 1,
    },
    compareButton: {
      backgroundColor: theme.accent,
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginLeft: 8,
    },
    compareButtonText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },
    clearButton: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.08)',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginLeft: 8,
    },
    clearText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },

    compareHintBar: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(233, 69, 96, 0.15)'
        : 'rgba(233, 69, 96, 0.08)',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    compareHintText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
      flex: 1,
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
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    statBoxValue: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '800',
    },
    statBoxLabel: {
      color: theme.textMuted,
      fontSize: 10,
      marginTop: 3,
      textAlign: 'center',
    },
    instructionText: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
    },

    // Single floating menu button (when panel is closed)
    floatingMenuButton: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: theme.overlayStrong,
      borderRadius: 8,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
      zIndex: 10,
    },
    floatingMenuIcon: {
      color: theme.text,
      fontSize: 18,
    },
  });
}
