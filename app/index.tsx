import React, { useState, useCallback, useEffect } from 'react';
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
import { MAPBOX_STYLE_URL } from '../src/constants/mapbox';
import { stateLaws, getAllStates } from '../src/data/stateLaws';
import { getReciprocityStatus } from '../src/data/reciprocity';
import { MapLegend } from '../src/components/MapLegend';
import { StateCard } from '../src/components/StateCard';
import { WebMap } from '../src/components/WebMap';
import { NavMenu } from '../src/components/NavMenu';
import { StateComparison } from '../src/components/StateComparison';
import { LawDetail } from '../src/components/LawDetail';
import { ReciprocityList } from '../src/components/ReciprocityList';
import { DisclaimerModal } from '../src/components/DisclaimerModal';

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
  const { width, height } = useWindowDimensions();
  const { theme, homeState } = useTheme();
  const isWide = width > 768;
  const { selectedState, activeState, selectState, getStateColor } = useReciprocityMap();
  const [panelOpen, setPanelOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuInlineState, setMenuInlineState] = useState<string | null>(null);
  const [menuInlineStateSource, setMenuInlineStateSource] = useState<'states' | 'nav'>('nav');
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

  // Reciprocity connection feature
  const [reciprocityCompareState, setReciprocityCompareState] = useState<string | null>(null);
  const [lineMidpoint, setLineMidpoint] = useState<{ x: number; y: number } | null>(null);
  const compareHomeColor = theme.reciprocity.home;
  const compareSelectedColor = lightenHexColor(theme.reciprocity.home, 0.35);

  // Clear the reciprocity connection whenever the viewed state changes
  useEffect(() => {
    setReciprocityCompareState(null);
    setLineMidpoint(null);
  }, [menuInlineState]);

  // Mutual exclusion: only one drawer open at a time
  const openPanel = useCallback(() => { setFlyoutOpen(false); setPanelOpen(true); }, []);
  const openFlyout = useCallback(() => { setPanelOpen(false); setFlyoutOpen(true); }, []);

  // Show a state inline inside the expanded menu (no separate panel)
  const openInlineState = useCallback((code: string, source: 'states' | 'nav') => {
    setFlyoutOpen(false);
    setPanelOpen(false);
    setMenuInlineState(code);
    setMenuInlineStateSource(source);
  }, []);

  const exitCompareMode = useCallback(() => {
    setCompareMode(false);
    setCompareStateA(null);
    setCompareStateB(null);
  }, []);

  // Wrapped color function: compare states take priority, inline-selected state is vivid blue
  const getMapStateColor = useCallback(
    (stateCode: string): string => {
      if (compareMode && compareStateA && compareStateB) {
        if (stateCode === compareStateA) return compareHomeColor;
        if (stateCode === compareStateB) return compareSelectedColor;
        return theme.reciprocity.default;
      }
      // Highlight the inline-selected state in light blue
      if (stateCode === menuInlineState) return '#80c4ff';
      return getStateColor(stateCode);
    },
    [menuInlineState, compareMode, compareStateA, compareStateB, compareHomeColor, compareSelectedColor, getStateColor, theme]
  );

  const handleStatePress = useCallback(
    (stateCode: string, shiftKey: boolean = false) => {
      // Shift-click: enter compare mode
      if (shiftKey && selectedState && selectedState !== stateCode) {
        setCompareStateA(selectedState);
        setCompareStateB(stateCode);
        setCompareMode(true);
        setShowAllStates(false);
        openPanel();
        return;
      }

      // In compare mode: pick or swap second state
      if (compareMode && compareStateA && stateCode !== compareStateA) {
        setCompareStateB(stateCode);
        openPanel();
        return;
      }

      // Clicking the already-selected state deselects it and resets the view
      // — expanded menu: state is shown inline
      if (stateCode === menuInlineState) {
        setMenuInlineState(null);
        selectState(null);
        setResetViewRequestId((id) => id + 1);
        setReciprocityCompareState(null);
        setLineMidpoint(null);
        return;
      }
      // — collapsed menu: state is shown in the side panel
      if (menuCollapsed && stateCode === selectedState && panelOpen) {
        setPanelOpen(false);
        selectState(null);
        setResetViewRequestId((id) => id + 1);
        return;
      }

      // Normal click: inline in expanded menu, panel when collapsed
      exitCompareMode();
      setShowAllStates(false);
      selectState(stateCode);
      setDetailTab('laws');
      setFocusStateCode(stateCode);
      setFocusRequestId((id) => id + 1);
      if (!menuCollapsed) {
        openInlineState(stateCode, 'nav');
      } else {
        openPanel();
      }
    },
    [selectedState, selectState, compareMode, compareStateA, exitCompareMode, menuCollapsed, openInlineState, openPanel, menuInlineState, panelOpen, setReciprocityCompareState, setLineMidpoint]
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
    setResetViewRequestId((id) => id + 1);
  }, [exitCompareMode, selectState]);

  const handleShowMap = useCallback(() => {
    setShowAllStates(false);
    exitCompareMode();
    if (homeState) {
      selectState(homeState);
      setDetailTab('laws');
      if (!menuCollapsed) {
        openInlineState(homeState, 'nav');
      } else {
        openPanel();
      }
    } else {
      setPanelOpen(false);
      setMenuInlineState(null);
    }
  }, [homeState, selectState, exitCompareMode, menuCollapsed, openInlineState, openPanel]);

  const handleShowStates = useCallback(() => {
    exitCompareMode();
    selectState(null);
    setShowAllStates(true);
    openPanel();
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

  // Clicking empty map area dismisses the current selection
  const handleMapDeselect = useCallback(() => {
    if (menuInlineState) {
      setMenuInlineState(null);
      selectState(null);
      setResetViewRequestId((id) => id + 1);
      setReciprocityCompareState(null);
      setLineMidpoint(null);
    } else if (panelOpen && selectedState) {
      setPanelOpen(false);
      selectState(null);
      setResetViewRequestId((id) => id + 1);
    }
  }, [menuInlineState, panelOpen, selectedState, selectState]);

  // Called when a state is selected from the inline States list inside the nav menu
  const handleSelectStateFromMenu = useCallback((stateCode: string) => {
    if (homeState && stateCode === homeState) return;
    exitCompareMode();
    setShowAllStates(false);
    selectState(stateCode);
    setFocusStateCode(stateCode);
    setFocusRequestId((id) => id + 1);
    openInlineState(stateCode, 'states');
  }, [homeState, exitCompareMode, selectState, openInlineState]);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  // Night Ops and MC Black use Mapbox dark-v11 for a near-black map base
  const mapStyleUrl = (theme.name === 'night-ops' || theme.name === 'multicam-black')
    ? 'mapbox://styles/mapbox/dark-v11'
    : MAPBOX_STYLE_URL;

  const MENU_COLLAPSED_WIDTH = 64;
  const menuExpandedWidth = isWide
    ? (menuInlineState ? 400 : 300)
    : width * 0.9;
  const menuWidth = menuCollapsed ? MENU_COLLAPSED_WIDTH : menuExpandedWidth;
  const panelDrawerWidth = isWide ? 420 : width - menuWidth;

  // True left offset of the visible map area — includes the panel drawer when open
  const mapLeftOffset = panelOpen ? menuWidth + panelDrawerWidth : menuWidth;

  const isComparing =
    compareMode && compareStateA && compareStateB &&
    stateLaws[compareStateA] && stateLaws[compareStateB];

  const isWaitingForCompare = compareMode && compareStateA && !compareStateB;

  const hasSelectedState = selectedState && stateLaws[selectedState] && !isComparing && !showAllStates;

  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      <DisclaimerModal />
      {/* Full-screen map */}
      <View style={s.mapContainer}>
        <WebMap
          selectedState={selectedState}
          onStatePress={handleStatePress}
          onDeselect={handleMapDeselect}
          getStateColor={getMapStateColor}
          focusStateCode={focusStateCode}
          focusStateRequestId={focusRequestId}
          resetViewRequestId={resetViewRequestId}
          leftOffset={mapLeftOffset}
          highlightStateCode={menuInlineState}
          mapStyleUrl={mapStyleUrl}
          connectStateA={menuInlineState}
          connectStateB={reciprocityCompareState}
          onLineMidpoint={(x, y) => setLineMidpoint({ x, y })}
        />
        <MapLegend
          activeState={activeState}
          compareMode={!!(compareMode && compareStateA && compareStateB)}
          compareStateA={compareStateA}
          compareStateB={compareStateB}
          compareHomeColor={compareHomeColor}
          compareSelectedColor={compareSelectedColor}
          inlineSelectedState={menuInlineState}
        />
      </View>

      {/* Always-visible nav menu */}
      <View style={[s.menuContainer, { width: menuWidth }]}>
        <NavMenu
          onClose={() => {}}
          onShowMap={handleShowMap}
          onShowStates={handleShowStates}
          onSelectStateFromMenu={handleSelectStateFromMenu}
          collapsed={menuCollapsed}
          onToggleCollapse={() => {
            if (!menuCollapsed) setMenuInlineState(null); // clear detail before shrinking
            setMenuCollapsed((c) => !c);
            setFlyoutOpen(false);
          }}
          flyoutOpen={flyoutOpen}
          onFlyoutChange={(open) => open ? openFlyout() : setFlyoutOpen(false)}
          inlineSelectedState={menuInlineState}
          inlineStateSource={menuInlineStateSource}
          onClearInlineState={() => { setMenuInlineState(null); selectState(null); setResetViewRequestId((id) => id + 1); }}
          onSelectCompareState={(code) => {
            // Toggle: tap same chip again to dismiss
            setReciprocityCompareState((prev) => (prev === code ? null : code));
            if (reciprocityCompareState === code) {
              setLineMidpoint(null);
            }
          }}
          reciprocityCompareState={reciprocityCompareState}
        />
      </View>

      {/* Expand/collapse toggle pinned to the menu border */}
      <Pressable
        style={[s.menuToggleButton, { left: menuWidth - 16, top: height / 2 - 16 }]}
        onPress={() => setMenuCollapsed((c) => !c)}
      >
        <Text style={s.menuToggleIcon}>{menuCollapsed ? '›' : '‹'}</Text>
      </Pressable>

      {/* Map/States drawer */}
      {panelOpen && (
        <View
          style={[
            s.floatingPanel,
            {
              width: panelDrawerWidth,
              left: menuWidth,
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

      {/* Reciprocity connection floating card */}
      {reciprocityCompareState && lineMidpoint && menuInlineState &&
        stateLaws[menuInlineState] && stateLaws[reciprocityCompareState] && (() => {
          const lawA = stateLaws[menuInlineState];
          const lawB = stateLaws[reciprocityCompareState];
          const status = getReciprocityStatus(menuInlineState, reciprocityCompareState);

          const statusLabelMap: Record<string, string> = {
            full: 'Honored',
            permitless: 'Permitless',
            none: 'Not Honored',
            home: 'Home',
            partial: 'Partial',
          };
          const statusLabel = statusLabelMap[status] ?? status;

          const statusColorMap: Record<string, string> = {
            full: theme.reciprocity.full,
            permitless: theme.reciprocity.permitless,
            none: theme.reciprocity.none,
            home: theme.reciprocity.home,
          };
          const statusColor = statusColorMap[status] ?? theme.textMuted;

          type CompRow = { label: string; a: string; b: string };
          const rows: CompRow[] = [
            {
              label: 'Concealed Carry',
              a: lawA.concealedCarry.replace(/-/g, ' '),
              b: lawB.concealedCarry.replace(/-/g, ' '),
            },
            {
              label: 'Open Carry',
              a: lawA.openCarry.replace(/-/g, ' '),
              b: lawB.openCarry.replace(/-/g, ' '),
            },
            {
              label: 'Permit Type',
              a: lawA.permitType.replace(/-/g, ' '),
              b: lawB.permitType.replace(/-/g, ' '),
            },
            {
              label: 'Stand Your Ground',
              a: lawA.standYourGround ? 'Yes' : 'No',
              b: lawB.standYourGround ? 'Yes' : 'No',
            },
            {
              label: 'Castle Doctrine',
              a: lawA.castleDoctrine ? 'Yes' : 'No',
              b: lawB.castleDoctrine ? 'Yes' : 'No',
            },
            {
              label: 'Red Flag Law',
              a: lawA.redFlagLaw ? 'Yes' : 'No',
              b: lawB.redFlagLaw ? 'Yes' : 'No',
            },
            {
              label: 'Magazine Limit',
              a: lawA.magazineRestriction != null ? `${lawA.magazineRestriction} rds` : 'None',
              b: lawB.magazineRestriction != null ? `${lawB.magazineRestriction} rds` : 'None',
            },
            {
              label: 'Permit to Buy',
              a: lawA.permitRequiredForPurchase ? 'Required' : 'No',
              b: lawB.permitRequiredForPurchase ? 'Required' : 'No',
            },
            {
              label: 'Background Check',
              a: lawA.universalBackgroundChecks ? 'Universal' : 'Standard',
              b: lawB.universalBackgroundChecks ? 'Universal' : 'Standard',
            },
          ];

          return (
            <View
              style={[
                s.connectionCard,
                {
                  left: lineMidpoint.x - 150,
                  top: lineMidpoint.y - 110,
                },
              ]}
              pointerEvents="box-none"
            >
              {/* Header */}
              <View style={s.connectionCardHeader}>
                <Text style={s.connectionCardTitle}>
                  {menuInlineState} ↔ {reciprocityCompareState}
                </Text>
                <Pressable
                  style={s.connectionCardClose}
                  onPress={() => {
                    setReciprocityCompareState(null);
                    setLineMidpoint(null);
                  }}
                  accessibilityLabel="Dismiss comparison card"
                  accessibilityRole="button"
                >
                  <Text style={s.connectionCardCloseText}>✕</Text>
                </Pressable>
              </View>

              {/* Reciprocity status badge */}
              <View style={[s.connectionStatusBadge, { backgroundColor: `${statusColor}22` }]}>
                <View style={[s.connectionStatusDot, { backgroundColor: statusColor }]} />
                <Text style={[s.connectionStatusText, { color: statusColor }]}>
                  {codeToStateName[menuInlineState]} permit: {statusLabel} in {codeToStateName[reciprocityCompareState]}
                </Text>
              </View>

              {/* Scrollable comparison table */}
              <ScrollView
                style={s.connectionTableScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <View style={s.connectionTable}>
                  {/* Column headers */}
                  <View style={s.connectionTableHeaderRow}>
                    <Text style={[s.connectionTableCell, s.connectionTableLabelCell]} />
                    <Text style={[s.connectionTableCell, s.connectionTableHeaderCell]}>{menuInlineState}</Text>
                    <Text style={[s.connectionTableCell, s.connectionTableHeaderCell]}>{reciprocityCompareState}</Text>
                  </View>
                  {rows.map((row) => (
                    <View key={row.label} style={s.connectionTableRow}>
                      <Text style={[s.connectionTableCell, s.connectionTableLabelCell]} numberOfLines={1}>
                        {row.label}
                      </Text>
                      <Text style={[s.connectionTableCell, s.connectionTableValueCell]} numberOfLines={1}>
                        {row.a}
                      </Text>
                      <Text style={[s.connectionTableCell, s.connectionTableValueCell]} numberOfLines={1}>
                        {row.b}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          );
        })()
      }

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

    // Menu border toggle
    menuToggleButton: {
      position: 'absolute',
      zIndex: 22,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.overlayStrong,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    menuToggleIcon: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 20,
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

    // Reciprocity connection floating card
    connectionCard: {
      position: 'absolute',
      width: 300,
      zIndex: 30,
      backgroundColor: theme.overlayStrong,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 12,
    },
    connectionTableScroll: {
      maxHeight: 260,
    },
    connectionCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    connectionCardTitle: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '700',
      flex: 1,
    },
    connectionCardClose: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 6,
    },
    connectionCardCloseText: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 14,
    },
    connectionStatusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
      marginBottom: 10,
    },
    connectionStatusDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      marginRight: 6,
      flexShrink: 0,
    },
    connectionStatusText: {
      fontSize: 10,
      fontWeight: '600',
      flex: 1,
    },
    connectionTable: {
      borderRadius: 6,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    connectionTableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    connectionTableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    connectionTableCell: {
      paddingHorizontal: 6,
      paddingVertical: 5,
    },
    connectionTableLabelCell: {
      flex: 2,
      color: theme.textMuted,
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    connectionTableHeaderCell: {
      flex: 1.5,
      color: theme.text,
      fontSize: 10,
      fontWeight: '700',
      textAlign: 'center',
    },
    connectionTableValueCell: {
      flex: 1.5,
      color: theme.text,
      fontSize: 10,
      fontWeight: '500',
      textAlign: 'center',
      textTransform: 'capitalize',
    },

  });
}
