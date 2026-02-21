import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';

interface NavMenuProps {
  onClose: () => void;
  onShowPanel?: () => void;
}

export function NavMenu({ onClose, onShowPanel }: NavMenuProps) {
  const { theme, themeName, setTheme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'nav' | 'settings'>('nav');
  const s = makeStyles(theme);

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
                if (onShowPanel) onShowPanel();
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

            {/* All States */}
            <Pressable
              style={s.navItem}
              onPress={() => {
                if (onShowPanel) onShowPanel();
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
            onPress={() => setActiveSection('nav')}
          >
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backLabel}>Settings</Text>
          </Pressable>

          <View style={s.divider} />

          {/* Appearance section */}
          <View style={s.settingsGroup}>
            <Text style={s.settingsGroupTitle}>Appearance</Text>

            {/* Dark mode toggle */}
            <View style={s.settingRow}>
              <View style={s.settingInfo}>
                <Text style={s.settingLabel}>Dark Mode</Text>
                <Text style={s.settingDesc}>Switch to dark interface</Text>
              </View>
              <Switch
                value={themeName === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.name === 'dark' ? '#555' : '#ccc',
                  true: theme.accent,
                }}
                thumbColor={'#fff'}
              />
            </View>

            {/* Theme picker */}
            <Text style={s.settingSubhead}>Theme</Text>

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
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
    settingSubhead: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 24,
      marginBottom: 12,
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
