import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';
import { getAllStates } from '../data/stateLaws';
import { codeToStateName } from '../hooks/useMapbox';

interface NavMenuProps {
  onClose: () => void;
  onShowMap?: () => void;
  onShowStates?: () => void;
}

export function NavMenu({ onClose, onShowMap, onShowStates }: NavMenuProps) {
  const { theme, themeName, setTheme, homeState, setHomeState } = useTheme();
  const [activeSection, setActiveSection] = useState<'nav' | 'settings'>('nav');
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const s = makeStyles(theme);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.logoRow}>
          <View style={s.logoIcon}>
            <Text style={s.logoIconText}>C</Text>
          </View>
          <View>
            <Text style={s.logoTitle}>CCW Map</Text>
            <Text style={s.logoSubtitle}>Reciprocity Guide</Text>
          </View>
        </View>
        <Pressable onPress={onClose} style={s.closeButton}>
          <Text style={s.closeText}>✕</Text>
        </Pressable>
      </View>

      <View style={s.divider} />

      {activeSection === 'nav' ? (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={s.navSection}>
            {/* Map */}
            <Pressable
              style={s.navItem}
              onPress={() => {
                if (onShowMap) onShowMap();
                else onClose();
              }}
            >
              <View style={s.navIconBox}>
                <Text style={s.navIconText}>M</Text>
              </View>
              <View style={s.navItemContent}>
                <Text style={s.navItemLabel}>Map</Text>
                <Text style={s.navItemDesc}>View reciprocity map</Text>
              </View>
            </Pressable>

            {/* States */}
            <Pressable
              style={s.navItem}
              onPress={() => {
                if (onShowStates) onShowStates();
                else onClose();
              }}
            >
              <View style={s.navIconBox}>
                <Text style={s.navIconText}>S</Text>
              </View>
              <View style={s.navItemContent}>
                <Text style={s.navItemLabel}>States</Text>
                <Text style={s.navItemDesc}>Browse all state laws</Text>
              </View>
            </Pressable>

            {/* Settings */}
            <Pressable
              style={s.navItem}
              onPress={() => setActiveSection('settings')}
            >
              <View style={s.navIconBox}>
                <Text style={s.navIconText}>G</Text>
              </View>
              <View style={s.navItemContent}>
                <Text style={s.navItemLabel}>Settings</Text>
                <Text style={s.navItemDesc}>Theme & preferences</Text>
              </View>
              <Text style={s.navArrow}>›</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Settings back button */}
          <Pressable
            style={s.backButton}
            onPress={() => {
              setActiveSection('nav');
              setStatePickerOpen(false);
            }}
          >
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backLabel}>Settings</Text>
          </Pressable>

          <View style={s.divider} />

          {/* Home State section */}
          <View style={s.settingsGroup}>
            <Text style={s.settingsGroupTitle}>General</Text>

            <View style={s.settingRowColumn}>
              <View style={s.settingInfo}>
                <Text style={s.settingLabel}>Home State</Text>
                <Text style={s.settingDesc}>
                  Your state for reciprocity lookups
                </Text>
              </View>
              <Pressable
                style={s.dropdown}
                onPress={() => setStatePickerOpen(!statePickerOpen)}
              >
                <Text style={s.dropdownText}>
                  {homeState ? codeToStateName[homeState] : 'Select a state'}
                </Text>
                <Text style={s.dropdownArrow}>
                  {statePickerOpen ? '▾' : '▸'}
                </Text>
              </Pressable>
            </View>

            {statePickerOpen && (
              <View style={s.pickerList}>
                {/* None option */}
                <Pressable
                  style={[
                    s.pickerItem,
                    !homeState && s.pickerItemActive,
                  ]}
                  onPress={() => {
                    setHomeState(null);
                    setStatePickerOpen(false);
                  }}
                >
                  <Text
                    style={[
                      s.pickerItemText,
                      !homeState && s.pickerItemTextActive,
                    ]}
                  >
                    None
                  </Text>
                </Pressable>
                {allStates.map((state) => (
                  <Pressable
                    key={state.stateCode}
                    style={[
                      s.pickerItem,
                      homeState === state.stateCode && s.pickerItemActive,
                    ]}
                    onPress={() => {
                      setHomeState(state.stateCode);
                      setStatePickerOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        s.pickerItemText,
                        homeState === state.stateCode && s.pickerItemTextActive,
                      ]}
                    >
                      {state.stateName}
                    </Text>
                    <Text style={s.pickerItemCode}>{state.stateCode}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={s.dividerFull} />

          {/* Theme section */}
          <View style={s.settingsGroup}>
            <Text style={s.settingsGroupTitle}>Theme</Text>

            <View style={s.themeGrid}>
              <Pressable
                style={[
                  s.themeCard,
                  themeName === 'light' && s.themeCardActive,
                ]}
                onPress={() => setTheme('light')}
              >
                <View style={s.themePreviewLight}>
                  <View style={s.previewBarLight} />
                  <View style={s.previewDotsRow}>
                    <View style={[s.previewDot, { backgroundColor: '#d0d0d0' }]} />
                    <View style={[s.previewDot, { backgroundColor: '#d0d0d0' }]} />
                  </View>
                </View>
                <Text
                  style={[
                    s.themeCardLabel,
                    themeName === 'light' && s.themeCardLabelActive,
                  ]}
                >
                  Light
                </Text>
              </Pressable>

              <Pressable
                style={[
                  s.themeCard,
                  themeName === 'dark' && s.themeCardActive,
                ]}
                onPress={() => setTheme('dark')}
              >
                <View style={s.themePreviewDark}>
                  <View style={s.previewBarDark} />
                  <View style={s.previewDotsRow}>
                    <View style={[s.previewDot, { backgroundColor: '#555' }]} />
                    <View style={[s.previewDot, { backgroundColor: '#555' }]} />
                  </View>
                </View>
                <Text
                  style={[
                    s.themeCardLabel,
                    themeName === 'dark' && s.themeCardLabelActive,
                  ]}
                >
                  Dark
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>CCW Reciprocity Map v1.0</Text>
      </View>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    logoIconText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '800',
    },
    logoTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '700',
    },
    logoSubtitle: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 1,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeText: {
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: 20,
    },
    dividerFull: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: 20,
      marginTop: 16,
    },

    // Nav section
    scrollArea: {
      flex: 1,
    },
    navSection: {
      paddingTop: 16,
      paddingHorizontal: 12,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 4,
    },
    navIconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    navIconText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
    },
    navItemContent: {
      flex: 1,
    },
    navItemLabel: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '600',
    },
    navItemDesc: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    navArrow: {
      color: theme.textMuted,
      fontSize: 22,
      fontWeight: '300',
    },

    // Settings back
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backArrow: {
      color: theme.accent,
      fontSize: 24,
      fontWeight: '500',
      marginRight: 8,
      marginTop: -2,
    },
    backLabel: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '700',
    },

    // Settings groups
    settingsGroup: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    settingsGroupTitle: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 16,
    },
    settingRowColumn: {
      paddingVertical: 4,
    },
    settingInfo: {
      flex: 1,
    },
    settingLabel: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    settingDesc: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    // Dropdown
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceLight,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
    dropdownArrow: {
      color: theme.textMuted,
      fontSize: 12,
    },

    // State picker list
    pickerList: {
      marginTop: 8,
      backgroundColor: theme.surfaceLight,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      maxHeight: 240,
      overflow: 'hidden',
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    pickerItemActive: {
      backgroundColor: theme.name === 'dark'
        ? 'rgba(233, 69, 96, 0.15)'
        : 'rgba(233, 69, 96, 0.08)',
    },
    pickerItemText: {
      color: theme.text,
      fontSize: 14,
    },
    pickerItemTextActive: {
      color: theme.accent,
      fontWeight: '600',
    },
    pickerItemCode: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },

    // Theme picker cards
    themeGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    themeCard: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      padding: 4,
      alignItems: 'center',
    },
    themeCardActive: {
      borderColor: theme.accent,
    },
    themePreviewLight: {
      width: '100%',
      height: 64,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      padding: 10,
      justifyContent: 'space-between',
    },
    previewBarLight: {
      width: '60%',
      height: 6,
      borderRadius: 3,
      backgroundColor: '#ddd',
    },
    themePreviewDark: {
      width: '100%',
      height: 64,
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      padding: 10,
      justifyContent: 'space-between',
    },
    previewBarDark: {
      width: '60%',
      height: 6,
      borderRadius: 3,
      backgroundColor: '#3a3a3a',
    },
    previewDotsRow: {
      flexDirection: 'row',
      gap: 4,
    },
    previewDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    themeCardLabel: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 8,
      marginBottom: 6,
    },
    themeCardLabelActive: {
      color: theme.text,
    },

    // Footer
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerText: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
    },
  });
}
