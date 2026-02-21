import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme, ThemeName } from '../constants/colors';

interface NavMenuProps {
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

export function NavMenu({ onClose, onNavigate }: NavMenuProps) {
  const { theme, themeName, setTheme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Menu</Text>
        <Pressable onPress={onClose} style={s.closeButton}>
          <Text style={s.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Nav items */}
        <Pressable
          style={s.navItem}
          onPress={() => {
            setShowSettings(false);
            onClose();
          }}
        >
          <Text style={s.navIcon}>🗺</Text>
          <Text style={s.navLabel}>Map</Text>
        </Pressable>

        <Pressable
          style={[s.navItem, showSettings && s.navItemActive]}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Text style={s.navIcon}>⚙</Text>
          <Text style={s.navLabel}>Settings</Text>
          <Text style={s.navChevron}>{showSettings ? '▾' : '▸'}</Text>
        </Pressable>

        {/* Settings sub-section */}
        {showSettings && (
          <View style={s.settingsSection}>
            {/* Theme section */}
            <Text style={s.settingsHeading}>Appearance</Text>

            <View style={s.settingRow}>
              <Text style={s.settingLabel}>Dark Mode</Text>
              <Switch
                value={themeName === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: theme.accent }}
                thumbColor={themeName === 'dark' ? '#fff' : '#f4f4f4'}
              />
            </View>

            <Text style={s.settingsHeading}>Theme</Text>

            <Pressable
              style={[s.themeOption, themeName === 'light' && s.themeOptionActive]}
              onPress={() => setTheme('light')}
            >
              <View style={[s.themePreview, { backgroundColor: '#f2f2f2' }]}>
                <View style={[s.themePreviewBar, { backgroundColor: '#ffffff' }]} />
              </View>
              <Text style={[s.themeOptionLabel, themeName === 'light' && s.themeOptionLabelActive]}>
                Light
              </Text>
            </Pressable>

            <Pressable
              style={[s.themeOption, themeName === 'dark' && s.themeOptionActive]}
              onPress={() => setTheme('dark')}
            >
              <View style={[s.themePreview, { backgroundColor: '#1a1a1a' }]}>
                <View style={[s.themePreviewBar, { backgroundColor: '#2a2a2a' }]} />
              </View>
              <Text style={[s.themeOptionLabel, themeName === 'dark' && s.themeOptionLabelActive]}>
                Dark
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>CCW Reciprocity Map</Text>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    closeButton: {
      padding: 4,
    },
    closeText: {
      color: theme.textMuted,
      fontSize: 18,
      fontWeight: '600',
    },
    scrollArea: {
      flex: 1,
      paddingTop: 8,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 8,
      marginHorizontal: 8,
      marginVertical: 2,
    },
    navItemActive: {
      backgroundColor: theme.surfaceLight,
    },
    navIcon: {
      fontSize: 16,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    navLabel: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '600',
      flex: 1,
    },
    navChevron: {
      color: theme.textMuted,
      fontSize: 12,
    },

    // Settings sub-section
    settingsSection: {
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 8,
      marginLeft: 20,
      borderLeftWidth: 2,
      borderLeftColor: theme.border,
      marginBottom: 8,
    },
    settingsHeading: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 12,
      marginBottom: 8,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    settingLabel: {
      color: theme.text,
      fontSize: 14,
    },

    // Theme options
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 4,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    themeOptionActive: {
      borderColor: theme.accent,
      backgroundColor: theme.name === 'dark'
        ? 'rgba(233, 69, 96, 0.1)'
        : 'rgba(233, 69, 96, 0.05)',
    },
    themePreview: {
      width: 36,
      height: 24,
      borderRadius: 4,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    themePreviewBar: {
      width: 20,
      height: 4,
      borderRadius: 2,
    },
    themeOptionLabel: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    themeOptionLabelActive: {
      color: theme.text,
      fontWeight: '600',
    },

    // Footer
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
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
