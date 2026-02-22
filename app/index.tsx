import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { Theme } from '../src/constants/colors';
import { useReciprocityMap, codeToStateName } from '../src/hooks/useMapbox';
import { stateLaws, getAllStates } from '../src/data/stateLaws';
import { MapLegend } from '../src/components/MapLegend';
import { StateCard } from '../src/components/StateCard';
import { WebMap } from '../src/components/WebMap';
import { NavMenu } from '../src/components/NavMenu';
import { StateComparison } from '../src/components/StateComparison';
import { LawDetail } from '../src/components/LawDetail';
import { ReciprocityList } from '../src/components/ReciprocityList';

function lightenHexColor(hex: string, factor: number): string {
  const safeFactor = Math.max(0, Math.min(1, factor));
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return hex;

  const mix = (value: number) => Math.round(value + (255 - value) * safeFactor);
  const toHex = (value: number) => mix(value).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function MapScreen() {
  const { width } = useWindowDimensions();
  const { theme, homeState } = useTheme();
  const isWide = width > 768;
  const { selectedState, activeState, selectState, getStateColor } = useReciprocityMap();
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [focusStateCode, setFocusStateCode] = useState<string | null>(null);
  const [resetViewRequestId, setResetViewRequestId] = useState(0);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareStateA, setCompareStateA] = useState<string | null>(null);
  const [compareStateB, setCompareStateB] = useState<string | null>(null);

  // Detail tab for selected state
  const [detailTab, setDetailTab] = useState<'laws' | 'reciprocity'>('laws');
  const compareHomeColor = theme.reciprocity.home;
  const compareSelectedColor = lightenHexColor(theme.reciprocity.home, 0.35);

  const exitCompareMode = useCallback(() => {
    setCompareMode(false);
    setCompareStateA(null);
    setCompareStateB(null);
  }, []);

  // Wrapped color function: compare states take priority
  const getMapStateColor = useCallback(
    (stateCode: string): string => {
      if (compareMode && compareStateA && compareStateB) {
        if (stateCode === compareStateA) return compareHomeColor;
        if (stateCode === compareStateB) return compareSelectedColor;
        return theme.reciprocity.default;
      }
      return getStateColor(stateCode);
    },
    [compareMode, compareStateA, compareStateB, compareHomeColor, compareSelectedColor, getStateColor, theme]
  );

  const handleStatePress = useCallback(
    (stateCode: string, shiftKey: boolean = false) => {
      // Shift-click: enter compare mode
      if (shiftKey && selectedState && selectedState !== stateCode) {
        setCompareStateA(selectedState);
        setCompareStateB(stateCode);
        setCompareMode(true);
        setShowAllStates(false);
        setPanelOpen(true);
        return;
      }

      // In compare mode: pick or swap second state
      if (compareMode && compareStateA && stateCode !== compareStateA) {
        setCompareStateB(stateCode);
        setPanelOpen(true);
        return;
      }

      // Normal click: select state and open drawer with detail
      exitCompareMode();
      setShowAllStates(false);
      selectState(stateCode);
      setDetailTab('laws');
      setPanelOpen(true);
    },
    [selectedState, selectState, compareMode, compareStateA, exitCompareMode]
  );

  const handleBackToStates = useCallback(() => {
    exitCompareMode();
    selectState(null);
    setShowAllStates(true);
    setResetViewRequestId((id) => id + 1);
  }, [exitCompareMode, selectState]);

  const handleClosePanelToMenu = useCallback(() => {
    exitCompareMode();
    selectState(null);
    setFocusStateCode(null);
    setPanelOpen(false);
    setShowAllStates(false);
    setMenuOpen(true);
    setResetViewRequestId((id) => id + 1);
  }, [exitCompareMode, selectState]);

  const handleShowMap = useCallback(() => {
    setMenuOpen(false);
    setShowAllStates(false);
    exitCompareMode();
    if (homeState) {
      selectState(homeState);
      setDetailTab('laws');
      setPanelOpen(true);
    } else {
      setPanelOpen(false);
    }
  }, [homeState, selectState, exitCompareMode]);

  const handleShowStates = useCallback(() => {
    setMenuOpen(false);
    exitCompareMode();
    selectState(null);
    setShowAllStates(true);
    setPanelOpen(true);
  }, [exitCompareMode, selectState]);

  // When tapping a state from the All States list
  const handleSelectFromList = useCallback((stateCode: string) => {
    if (homeState && stateCode === homeState) {
      return;
    }
    exitCompareMode();
    setShowAllStates(false);
    selectState(stateCode);
    setDetailTab('laws');
    setFocusStateCode(stateCode);
    setFocusRequestId((id) => id + 1);
  }, [homeState, selectState, exitCompareMode]);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  const panelDrawerWidth = isWide ? 420 : width * 0.92;
  const menuDrawerWidth = isWide ? 300 : width * 0.8;

  const isComparing =
    compareMode && compareStateA && compareStateB &&
    stateLaws[compareStateA] && stateLaws[compareStateB];

  const isWaitingForCompare = compareMode && compareStateA && !compareStateB;

  const hasSelectedState = selectedState && stateLaws[selectedState] && !isComparing && !showAllStates;

  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      {/* Full-screen map */}
      <View style={s.mapContainer}>
        <WebMap
          selectedState={selectedState}
          onStatePress={handleStatePress}
          getStateColor={getMapStateColor}
          focusStateCode={focusStateCode}
          focusStateRequestId={focusRequestId}
          resetViewRequestId={resetViewRequestId}
        />
        <MapLegend
          activeState={activeState}
          compareMode={!!(compareMode && compareStateA && compareStateB)}
          compareStateA={compareStateA}
          compareStateB={compareStateB}
          compareHomeColor={compareHomeColor}
          compareSelectedColor={compareSelectedColor}
        />
      </View>

      {/* Map/States drawer */}
      {panelOpen && !menuOpen && (
        <View
          style={[
            s.floatingPanel,
            {
              width: panelDrawerWidth,
            },
          ]}
        >
          {/* Panel header */}
          <View style={s.panelHeader}>
            {hasSelectedState ? (
              <View style={s.tabRow}>
                <Pressable
                  style={[s.tabButton, detailTab === 'laws' && s.tabButtonActive]}
                  onPress={() => setDetailTab('laws')}
                >
                  <Text style={[s.tabText, detailTab === 'laws' && s.tabTextActive]}>
                    Laws & Details
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.tabButton, detailTab === 'reciprocity' && s.tabButtonActive]}
                  onPress={() => setDetailTab('reciprocity')}
                >
                  <Text style={[s.tabText, detailTab === 'reciprocity' && s.tabTextActive]}>
                    Reciprocity
                  </Text>
                </Pressable>
              </View>
            ) : isComparing ? (
              <View style={s.tabRow}>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>
                    Comparing
                  </Text>
                </View>
              </View>
            ) : showAllStates ? (
              <View style={s.tabRow}>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>
                    All States
                  </Text>
                </View>
              </View>
            ) : (
              <View style={s.tabRow} />
            )}

            <Pressable
              onPress={handleClosePanelToMenu}
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
              <Pressable onPress={() => { exitCompareMode(); setPanelOpen(false); }} style={s.clearButton}>
                <Text style={s.clearText}>Cancel</Text>
              </Pressable>
            </View>
          )}

          {/* Selected state action bar */}
          {hasSelectedState && (
            <View style={s.selectionBar}>
              <Pressable
                onPress={handleBackToStates}
                style={s.statesButton}
              >
                <Text style={s.statesChevron}>‹</Text>
                <Text style={s.statesButtonText}>States</Text>
              </Pressable>
            </View>
          )}

          {hasSelectedState && (
            <View style={s.selectedStateHeader}>
              <Text style={s.selectedStateHeaderText}>
                {codeToStateName[selectedState!]}
              </Text>
            </View>
          )}

          {/* Panel body */}
          {hasSelectedState ? (
            <View style={s.detailContainer}>
              <ScrollView
                style={s.scrollArea}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
              >
                {detailTab === 'laws' ? (
                  <LawDetail law={stateLaws[selectedState!]} />
                ) : (
                  <ReciprocityList stateCode={selectedState!} />
                )}
              </ScrollView>
            </View>
          ) : isComparing ? (
            <StateComparison
              stateA={stateLaws[compareStateA!]}
              stateB={stateLaws[compareStateB!]}
              onClose={exitCompareMode}
            />
          ) : showAllStates ? (
            <ScrollView
              style={s.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.scrollContent}
            >
              {allStates.map((law) => (
                <StateCard
                  key={law.stateCode}
                  law={law}
                  disabled={!!homeState && law.stateCode === homeState}
                  onPress={() => handleSelectFromList(law.stateCode)}
                />
              ))}
            </ScrollView>
          ) : null}
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
          <View style={[s.menuContainer, { width: menuDrawerWidth }]}>
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

    // Map/States drawer
    floatingPanel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: theme.surface,
      overflow: 'hidden',
      zIndex: 19,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    panelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    statesButton: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(10, 20, 34, 0.55)'
        : 'rgba(21, 40, 67, 0.18)',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    statesChevron: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '700',
      marginRight: 6,
      lineHeight: 14,
    },
    statesButtonText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    selectedStateHeader: {
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 6,
    },
    selectedStateHeaderText: {
      color: theme.text,
      fontSize: 34,
      fontWeight: '700',
      lineHeight: 36,
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

    detailContainer: {
      flex: 1,
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
