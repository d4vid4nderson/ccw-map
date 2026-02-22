import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { Theme, themeList } from '../constants/colors';
import { getAllStates } from '../data/stateLaws';
import { codeToStateName } from '../hooks/useMapbox';

interface NavMenuProps {
  onClose: () => void;
  onShowMap?: () => void;
  onShowStates?: () => void;
}

const weaponImageMap = {
  'Beretta APX': require('../../assets/silohettes/beretta-apx.png'),
  'Beretta M9': require('../../assets/silohettes/beretta-m9.png'),
  'Beretta PX4': require('../../assets/silohettes/beretta-px4.png'),
  'Glock 19': require('../../assets/silohettes/glock-19.png'),
  'Glock 43x': require('../../assets/silohettes/glock-43x.png'),
  'Sig Sauer P320': require('../../assets/silohettes/sig-sauer-p320.png'),
  'Sig Sauer P365x': require('../../assets/silohettes/sig-sauer-p365x.png'),
  'Staccato CS': require('../../assets/silohettes/staccato-cs.png'),
  'Staccato HD P4.5': require('../../assets/silohettes/staccato-hd-p45.png'),
} as const;

const weaponOptions = Object.keys(weaponImageMap) as Array<keyof typeof weaponImageMap>;
type SettingsSection = 'homeState' | 'theme' | 'weapon';

function MapIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <Path d="M15 5.764v15" />
      <Path d="M9 3.236v15" />
    </Svg>
  );
}

function StateIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 5h.01" />
      <Path d="M3 12h.01" />
      <Path d="M3 19h.01" />
      <Path d="M8 5h13" />
      <Path d="M8 12h13" />
      <Path d="M8 19h13" />
    </Svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function NavMenu({ onClose, onShowMap, onShowStates }: NavMenuProps) {
  const {
    theme,
    themeName,
    setTheme,
    homeState,
    setHomeState,
    weaponName,
    setWeaponName,
  } = useTheme();
  const [activeSection, setActiveSection] = useState<'nav' | 'settings'>('nav');
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SettingsSection | null>('homeState');
  const s = makeStyles(theme);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );
  const toggleSettingsSection = (section: SettingsSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    if (section !== 'homeState') {
      setStatePickerOpen(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerContent}>
          <View style={s.logoRow}>
            <View style={s.logoIcon}>
              <Image
                source={weaponImageMap[weaponName]}
                style={s.logoWeaponImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={s.logoTitle}>CONCEAL</Text>
              <Text style={s.logoTitle}>CARRY</Text>
              <Text style={s.logoTitle}>WEAPON</Text>
            </View>
          </View>
          <Text style={s.logoDescription}>
            Track reciprocity and carry laws by state so you can plan travel with faster, safer decisions.
          </Text>
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
                <MapIcon color={theme.text} />
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
                <StateIcon color={theme.text} />
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
                <SettingsIcon color={theme.text} />
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
              setExpandedSection('homeState');
            }}
          >
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backLabel}>Settings</Text>
          </Pressable>

          <View style={s.divider} />

          {/* Home State section */}
          <View style={s.settingsGroup}>
            <Pressable style={s.sectionHeader} onPress={() => toggleSettingsSection('homeState')}>
              <Text style={s.settingsGroupTitle}>Home State</Text>
              <Text style={s.sectionChevron}>{expandedSection === 'homeState' ? '▾' : '▸'}</Text>
            </Pressable>

            {expandedSection === 'homeState' && (
              <View style={s.settingRowColumn}>
                <View style={s.settingInfo}>
                  <Text style={s.settingLabel}>Default Reciprocity State</Text>
                  <Text style={s.settingDesc}>Used for reciprocity lookups on load</Text>
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

                {statePickerOpen && (
                  <ScrollView style={s.pickerList} nestedScrollEnabled>
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
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          <View style={s.dividerFull} />

          {/* Theme section */}
          <View style={s.settingsGroup}>
            <Pressable style={s.sectionHeader} onPress={() => toggleSettingsSection('theme')}>
              <Text style={s.settingsGroupTitle}>Theme</Text>
              <Text style={s.sectionChevron}>{expandedSection === 'theme' ? '▾' : '▸'}</Text>
            </Pressable>

            {expandedSection === 'theme' && (
              <View style={s.themeGrid}>
                {themeList.map((t) => (
                  <Pressable
                    key={t.name}
                    style={[
                      s.themeCard,
                      themeName === t.name && s.themeCardActive,
                    ]}
                    onPress={() => setTheme(t.name)}
                  >
                    <View style={[s.themePreview, { backgroundColor: t.previewBg }]}>
                      <View style={[s.previewBar, { backgroundColor: t.previewBar }]} />
                      <View style={s.previewDotsRow}>
                        <View style={[s.previewDot, { backgroundColor: t.previewDots[0] }]} />
                        <View style={[s.previewDot, { backgroundColor: t.previewDots[1] }]} />
                      </View>
                    </View>
                    <Text
                      style={[
                        s.themeCardLabel,
                        themeName === t.name && s.themeCardLabelActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={s.dividerFull} />

          {/* Weapon section */}
          <View style={s.settingsGroup}>
            <Pressable style={s.sectionHeader} onPress={() => toggleSettingsSection('weapon')}>
              <Text style={s.settingsGroupTitle}>Weapon</Text>
              <Text style={s.sectionChevron}>{expandedSection === 'weapon' ? '▾' : '▸'}</Text>
            </Pressable>

            {expandedSection === 'weapon' && (
              <View style={s.weaponGrid}>
                {weaponOptions.map((weapon) => (
                  <Pressable
                    key={weapon}
                    style={[
                      s.weaponCard,
                      weaponName === weapon && s.weaponCardActive,
                    ]}
                    onPress={() => setWeaponName(weapon)}
                  >
                    <View style={s.weaponPreview}>
                      <Image
                        source={weaponImageMap[weapon]}
                        style={s.weaponPreviewImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={[
                        s.weaponCardLabel,
                        weaponName === weapon && s.weaponCardLabelActive,
                      ]}
                    >
                      {weapon}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
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
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
    },
    headerContent: {
      flex: 1,
      paddingRight: 12,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoIcon: {
      width: 72,
      height: 72,
      borderRadius: 14,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    logoWeaponImage: {
      width: 52,
      height: 52,
    },
    logoTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 24,
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
    logoDescription: {
      color: theme.textMuted,
      fontSize: 11,
      lineHeight: 14,
      maxWidth: 250,
      marginTop: 10,
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
      marginBottom: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    sectionChevron: {
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: '700',
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
      flexWrap: 'wrap',
      gap: 8,
    },
    themeCard: {
      width: '47%',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.border,
      padding: 3,
      alignItems: 'center',
    },
    themeCardActive: {
      borderColor: theme.accent,
    },
    themePreview: {
      width: '100%',
      height: 48,
      borderRadius: 7,
      padding: 8,
      justifyContent: 'space-between',
    },
    previewBar: {
      width: '55%',
      height: 5,
      borderRadius: 3,
    },
    previewDotsRow: {
      flexDirection: 'row',
      gap: 3,
    },
    previewDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    themeCardLabel: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 5,
      marginBottom: 4,
    },
    themeCardLabelActive: {
      color: theme.text,
    },
    weaponGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    weaponCard: {
      width: '47%',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.border,
      padding: 3,
      alignItems: 'center',
    },
    weaponCardActive: {
      borderColor: theme.accent,
    },
    weaponPreview: {
      width: '100%',
      height: 48,
      borderRadius: 7,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
    },
    weaponPreviewImage: {
      width: 36,
      height: 36,
    },
    weaponCardLabel: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 5,
      marginBottom: 4,
      textAlign: 'center',
    },
    weaponCardLabelActive: {
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
