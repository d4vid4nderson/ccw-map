import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TextInput, Linking, Modal } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { Theme, themeList } from '../constants/colors';
import { getAllStates, stateLaws } from '../data/stateLaws';
import { codeToStateName } from '../hooks/useMapbox';
import { LawDetail } from './LawDetail';
import { ReciprocityList } from './ReciprocityList';

interface NavMenuProps {
  onClose: () => void;
  onShowMap?: () => void;
  onShowStates?: () => void;
  onSelectStateFromMenu?: (code: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  flyoutOpen?: boolean;
  onFlyoutChange?: (open: boolean) => void;
  inlineSelectedState?: string | null;
  inlineStateSource?: 'states' | 'nav';
  onClearInlineState?: () => void;
  onSelectCompareState?: (code: string) => void;
  reciprocityCompareState?: string | null;
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

export function NavMenu({ onClose, onShowMap, onShowStates, onSelectStateFromMenu, collapsed = false, onToggleCollapse, flyoutOpen = false, onFlyoutChange, inlineSelectedState, inlineStateSource = 'nav', onClearInlineState, onSelectCompareState, reciprocityCompareState }: NavMenuProps) {
  const {
    theme,
    themeName,
    setTheme,
    homeState,
    setHomeState,
    weaponName,
    setWeaponName,
  } = useTheme();
  const [activeSection, setActiveSection] = useState<'nav' | 'settings' | 'states' | 'stateDetail'>('nav');
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SettingsSection | null>('homeState');
  const [stateDetailTab, setStateDetailTab] = useState<'laws' | 'reciprocity'>('laws');
  const [weaponDropdownOpen, setWeaponDropdownOpen] = useState(false);
  const [weaponRequestOpen, setWeaponRequestOpen] = useState(false);
  const [weaponRequestName, setWeaponRequestName] = useState('');
  const [weaponRequestEmail, setWeaponRequestEmail] = useState('');
  const [weaponRequestGun, setWeaponRequestGun] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'disclaimer' | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const s = makeStyles(theme);

  useEffect(() => {
    if (inlineSelectedState) {
      setActiveSection('stateDetail');
      setStateDetailTab('laws');
    } else {
      setActiveSection((prev) => prev === 'stateDetail' ? 'nav' : prev);
    }
  }, [inlineSelectedState]);

  const allStates = getAllStates().sort((a, b) =>
    a.stateName.localeCompare(b.stateName)
  );

  const toggleSettingsSection = (section: SettingsSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    if (section !== 'homeState') {
      setStatePickerOpen(false);
    }
  };

  // Shared settings content — used in both expanded sidebar and flyout panel
  function renderSettingsContent() {
    return (
      <>
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

      </>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      {collapsed ? (
        <View style={s.headerCollapsed}>
          <View style={s.logoIconSmall}>
            <Image
              source={weaponImageMap[weaponName]}
              style={s.logoWeaponImageSmall}
              resizeMode="contain"
            />
          </View>
        </View>
      ) : (
        <View style={s.header}>
          <View style={s.headerContent}>
            <View style={s.logoRow}>
              {/* Weapon icon with dropdown chevron */}
              <View style={s.logoIconWrapper}>
                <View style={s.logoIcon}>
                  <Image
                    source={weaponImageMap[weaponName]}
                    style={s.logoWeaponImage}
                    resizeMode="contain"
                  />
                </View>
                <Pressable
                  style={s.weaponChevronBtn}
                  onPress={() => setWeaponDropdownOpen((o) => !o)}
                  accessibilityRole="button"
                  accessibilityLabel="Choose weapon"
                >
                  <Text style={s.weaponChevronText}>
                    {weaponDropdownOpen ? '▴' : '▾'}
                  </Text>
                </Pressable>
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
        </View>
      )}

      <View style={s.divider} />

      {(activeSection === 'nav' || collapsed) ? (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={[s.navSection, collapsed && s.navSectionCollapsed]}>
            {/* Map */}
            <Pressable
              style={[s.navItem, collapsed && s.navItemCollapsed]}
              onPress={() => {
                if (onShowMap) onShowMap();
                else onClose();
              }}
            >
              <View style={[s.navIconBox, collapsed && s.navIconBoxCollapsed]}>
                <MapIcon color={theme.text} />
              </View>
              {!collapsed && (
                <View style={s.navItemContent}>
                  <Text style={s.navItemLabel}>Map</Text>
                  <Text style={s.navItemDesc}>View reciprocity map</Text>
                </View>
              )}
            </Pressable>

            {/* States */}
            <Pressable
              style={[s.navItem, collapsed && s.navItemCollapsed]}
              onPress={() => {
                if (collapsed) onToggleCollapse?.();
                setActiveSection('states');
              }}
            >
              <View style={[s.navIconBox, collapsed && s.navIconBoxCollapsed]}>
                <StateIcon color={theme.text} />
              </View>
              {!collapsed && (
                <>
                  <View style={s.navItemContent}>
                    <Text style={s.navItemLabel}>States</Text>
                    <Text style={s.navItemDesc}>Browse all state laws</Text>
                  </View>
                  <Text style={s.navArrow}>›</Text>
                </>
              )}
            </Pressable>

            {/* Settings */}
            <Pressable
              style={[s.navItem, collapsed && s.navItemCollapsed]}
              onPress={() => {
                if (collapsed) {
                  // Open flyout instead of expanding the menu
                  onFlyoutChange?.(true);
                } else {
                  setActiveSection('settings');
                }
              }}
            >
              <View style={[s.navIconBox, collapsed && s.navIconBoxCollapsed]}>
                <SettingsIcon color={theme.text} />
              </View>
              {!collapsed && (
                <>
                  <View style={s.navItemContent}>
                    <Text style={s.navItemLabel}>Settings</Text>
                    <Text style={s.navItemDesc}>Theme & preferences</Text>
                  </View>
                  <Text style={s.navArrow}>›</Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      ) : activeSection === 'stateDetail' && inlineSelectedState && stateLaws[inlineSelectedState] ? (
        <>
          {/* State detail header: back button + tabs */}
          <View style={s.stateDetailHeader}>
            <Pressable
              style={s.backButton}
              onPress={() => {
                setActiveSection(inlineStateSource === 'states' ? 'states' : 'nav');
                onClearInlineState?.();
              }}
            >
              <Text style={s.backArrow}>‹</Text>
              <Text style={s.backLabel}>{inlineStateSource === 'states' ? 'States' : 'Back'}</Text>
            </Pressable>
            <View style={s.stateDetailTabRow}>
              <Pressable
                style={[s.stateDetailTabBtn, stateDetailTab === 'laws' && s.stateDetailTabBtnActive]}
                onPress={() => setStateDetailTab('laws')}
              >
                <Text style={[s.stateDetailTabText, stateDetailTab === 'laws' && s.stateDetailTabTextActive]}>
                  Laws & Details
                </Text>
              </Pressable>
              <Pressable
                style={[s.stateDetailTabBtn, stateDetailTab === 'reciprocity' && s.stateDetailTabBtnActive]}
                onPress={() => setStateDetailTab('reciprocity')}
              >
                <Text style={[s.stateDetailTabText, stateDetailTab === 'reciprocity' && s.stateDetailTabTextActive]}>
                  Reciprocity
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={s.divider} />
          <Text style={s.stateDetailName}>{codeToStateName[inlineSelectedState]}</Text>
          <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={s.stateDetailScroll}>
            {stateDetailTab === 'laws' ? (
              <LawDetail law={stateLaws[inlineSelectedState]} />
            ) : (
              <ReciprocityList
                stateCode={inlineSelectedState}
                onSelectCompareState={onSelectCompareState}
                selectedCompareState={reciprocityCompareState}
              />
            )}
          </ScrollView>
        </>
      ) : activeSection === 'states' ? (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          {/* States back button */}
          <Pressable
            style={s.backButton}
            onPress={() => setActiveSection('nav')}
          >
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backLabel}>States</Text>
          </Pressable>

          <View style={s.divider} />

          {allStates.map((state) => (
            <Pressable
              key={state.stateCode}
              style={[
                s.statesListItem,
                homeState === state.stateCode && s.statesListItemHome,
              ]}
              onPress={() => {
                if (homeState === state.stateCode) return;
                setActiveSection('nav');
                onSelectStateFromMenu?.(state.stateCode);
              }}
            >
              <Text style={s.statesListItemName}>{state.stateName}</Text>
              <Text style={s.statesListItemCode}>{state.stateCode}</Text>
            </Pressable>
          ))}
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

          {renderSettingsContent()}
        </ScrollView>
      )}

      {/* Footer */}
      {!collapsed && (
        <View style={s.footer}>
          <Text style={s.footerText}>CCW Reciprocity Map v1.0</Text>
          <View style={s.footerLinks}>
            <Pressable onPress={() => setLegalModal('terms')} accessibilityRole="button">
              <Text style={s.footerLink}>Terms &amp; Conditions</Text>
            </Pressable>
            <Text style={s.footerLinkSep}>·</Text>
            <Pressable onPress={() => setLegalModal('disclaimer')} accessibilityRole="button">
              <Text style={s.footerLink}>Disclaimer</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Weapon picker dropdown — floats over nav items, does not push content */}
      {weaponDropdownOpen && !collapsed && (
        <>
          <Pressable
            style={s.weaponDropdownBackdrop}
            onPress={() => setWeaponDropdownOpen(false)}
          />
          <ScrollView
            style={s.weaponDropdown}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {weaponOptions.map((name) => {
              const isActive = weaponName === name;
              return (
                <Pressable
                  key={name}
                  style={[s.weaponDropdownItem, isActive && s.weaponDropdownItemActive]}
                  onPress={() => {
                    setWeaponName(name);
                    setWeaponDropdownOpen(false);
                  }}
                >
                  <Image
                    source={weaponImageMap[name]}
                    style={s.weaponDropdownImage}
                    resizeMode="contain"
                  />
                  <Text style={[s.weaponDropdownLabel, isActive && s.weaponDropdownLabelActive]}>
                    {name}
                  </Text>
                  {isActive && <Text style={s.weaponDropdownCheck}>✓</Text>}
                </Pressable>
              );
            })}
            {/* More coming soon + request button */}
            <View style={s.weaponDropdownMoreRow}>
              <Text style={s.weaponDropdownMoreText}>MORE COMING SOON</Text>
              <Pressable
                style={s.weaponRequestBtn}
                onPress={() => {
                  setWeaponRequestOpen(true);
                  setWeaponRequestName('');
                  setWeaponRequestGun('');
                  setWeaponDropdownOpen(false);
                }}
              >
                <Text style={s.weaponRequestBtnText}>+ Request</Text>
              </Pressable>
            </View>
          </ScrollView>
        </>
      )}

      {/* Weapon request modal */}
      <Modal
        visible={weaponRequestOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setWeaponRequestOpen(false)}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setWeaponRequestOpen(false)}
        />
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Request a Weapon</Text>
            <Pressable onPress={() => setWeaponRequestOpen(false)} style={s.modalCloseBtn}>
              <Text style={s.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <Text style={s.modalSubtitle}>
            We'll add your request to our backlog. Fill in your details so we can follow up!
          </Text>

          <Text style={s.modalFieldLabel}>Your Name</Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. John Smith"
            placeholderTextColor={s.modalPlaceholder.color}
            value={weaponRequestName}
            onChangeText={setWeaponRequestName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={s.modalFieldLabel}>Your Email <Text style={s.modalFieldOptional}>(optional)</Text></Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. john@example.com"
            placeholderTextColor={s.modalPlaceholder.color}
            value={weaponRequestEmail}
            onChangeText={setWeaponRequestEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Text style={s.modalFieldLabel}>Gun Name / Type</Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. Glock 17, Walther PDP..."
            placeholderTextColor={s.modalPlaceholder.color}
            value={weaponRequestGun}
            onChangeText={setWeaponRequestGun}
            autoCapitalize="words"
            returnKeyType="send"
          />

          <Pressable
            style={[s.modalSendBtn, !weaponRequestGun.trim() && s.modalSendBtnDisabled]}
            disabled={!weaponRequestGun.trim()}
            onPress={() => {
              if (!weaponRequestGun.trim()) return;
              const subject = encodeURIComponent(`Weapon Icon Request: ${weaponRequestGun.trim()}`);
              const body = encodeURIComponent(
                `Hi,\n\nI'd like to request a weapon icon be added to the CCW Map app.\n\nWeapon: ${weaponRequestGun.trim()}\nRequested by: ${weaponRequestName.trim() || 'Anonymous'}${weaponRequestEmail.trim() ? `\nReply-to: ${weaponRequestEmail.trim()}` : ''}\n\nThanks!`
              );
              const CONTACT = atob('ZGF2aWQ0bmRlcnNvbkBwbS5tZQ==');
              Linking.openURL(`mailto:${CONTACT}?subject=${subject}&body=${body}`);
              setWeaponRequestName('');
              setWeaponRequestEmail('');
              setWeaponRequestGun('');
              setWeaponRequestOpen(false);
            }}
          >
            <Text style={s.modalSendText}>Send Request</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Legal modal — Terms & Conditions / Disclaimer */}
      <Modal
        visible={legalModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setLegalModal(null)}
      >
        <View style={s.legalOverlay}>
          <View style={s.legalCard}>
            {/* Header */}
            <View style={s.legalHeader}>
              <Text style={s.legalTitle}>
                {legalModal === 'terms' ? 'Terms & Conditions' : 'Disclaimer'}
              </Text>
              <Pressable onPress={() => setLegalModal(null)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={s.legalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.legalScrollContent}
            >
              {legalModal === 'terms' ? (
                <>
                  <Text style={s.legalSectionTitle}>1. Acceptance of Terms</Text>
                  <Text style={s.legalBody}>
                    By downloading, installing, or using CCW Map ("the Application"), you agree
                    to be bound by these Terms and Conditions. If you do not agree, do not use
                    the Application. These terms may be updated at any time without prior notice,
                    and continued use constitutes acceptance of the revised terms.
                  </Text>

                  <Text style={s.legalSectionTitle}>2. Informational Purpose Only</Text>
                  <Text style={s.legalBody}>
                    CCW Map is designed solely as an informational reference tool. Nothing within
                    this Application constitutes legal advice, legal counsel, or a legal opinion.
                    The information provided does not create an attorney-client relationship and
                    should not be relied upon as a definitive or current statement of the law.
                  </Text>

                  <Text style={s.legalSectionTitle}>3. User Responsibilities</Text>
                  <Text style={s.legalBody}>
                    You are solely and entirely responsible for ensuring your compliance with all
                    applicable federal, state, and local laws regarding the purchase, possession,
                    carrying, transportation, and use of firearms and ammunition. Laws change
                    frequently and vary significantly by jurisdiction. You must independently
                    verify all information before acting upon it.
                  </Text>

                  <Text style={s.legalSectionTitle}>4. No Warranty</Text>
                  <Text style={s.legalBody}>
                    The Application and all content therein are provided on an "as is" and "as
                    available" basis without warranties of any kind, either express or implied,
                    including but not limited to warranties of merchantability, fitness for a
                    particular purpose, accuracy, completeness, or non-infringement. We do not
                    warrant that the information is current, correct, or free from error.
                  </Text>

                  <Text style={s.legalSectionTitle}>5. Limitation of Liability</Text>
                  <Text style={s.legalBody}>
                    To the fullest extent permitted by applicable law, the developers, owners,
                    contributors, and distributors of CCW Map shall not be liable for any direct,
                    indirect, incidental, special, consequential, or punitive damages arising out
                    of your access to or use of (or inability to use) this Application, including
                    but not limited to any legal consequences, fines, arrests, or other outcomes
                    related to firearm laws.
                  </Text>

                  <Text style={s.legalSectionTitle}>6. Third-Party Data</Text>
                  <Text style={s.legalBody}>
                    Reciprocity data, permit requirements, and other state law summaries are
                    compiled from publicly available government sources. We do not guarantee
                    the accuracy or timeliness of this data. Always consult official state
                    government websites or a licensed firearms attorney for authoritative
                    information.
                  </Text>

                  <Text style={s.legalSectionTitle}>7. Governing Law</Text>
                  <Text style={s.legalBody}>
                    These Terms and Conditions shall be governed by and construed in accordance
                    with applicable law, without regard to conflict of law provisions. Any
                    disputes arising from use of this Application shall be resolved in the
                    jurisdiction where the developer resides.
                  </Text>

                  <Text style={s.legalSectionTitle}>8. Contact</Text>
                  <Text style={s.legalBody}>
                    For questions or concerns regarding these Terms and Conditions,
                    please reach out through the form below.
                  </Text>
                  <Pressable
                    style={s.contactUsBtn}
                    onPress={() => { setLegalModal(null); setContactModalOpen(true); }}
                    accessibilityRole="button"
                  >
                    <Text style={s.contactUsBtnText}>Contact Us</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={s.legalSectionTitle}>Informational Use Only</Text>
                  <Text style={s.legalBody}>
                    CCW Map is provided strictly for informational and educational purposes. The
                    content within this application does not constitute legal advice and must not
                    be relied upon as a substitute for consultation with a qualified attorney or
                    law enforcement professional.
                  </Text>

                  <Text style={s.legalSectionTitle}>Accuracy of Information</Text>
                  <Text style={s.legalBody}>
                    Firearm laws are highly complex, subject to frequent change, and vary
                    significantly between federal, state, and local jurisdictions. While we
                    strive to keep information current and accurate, we make no warranties
                    regarding the completeness, accuracy, or timeliness of any content displayed.
                  </Text>

                  <Text style={s.legalSectionTitle}>Your Responsibility</Text>
                  <Text style={s.legalBody}>
                    You are solely responsible for knowing, understanding, and complying with
                    all applicable laws before carrying a firearm — including those governing
                    transportation, reciprocity, permitted carry locations, and use of force.
                    Traveling across state lines with a firearm carries serious legal obligations
                    that this app cannot fully capture or predict.
                  </Text>

                  <Text style={s.legalSectionTitle}>No Liability</Text>
                  <Text style={s.legalBody}>
                    The developers, contributors, and distributors of CCW Map assume no
                    liability for any legal consequences, citations, arrests, or other outcomes
                    arising from reliance on information provided by this application. Always
                    verify current laws through official government sources or a licensed
                    firearms attorney before traveling with a firearm.
                  </Text>

                  <Text style={s.legalSectionTitle}>Emergency Situations</Text>
                  <Text style={s.legalBody}>
                    This application is not intended for use in emergency situations. If you
                    are in an emergency, contact local law enforcement immediately.
                  </Text>
                </>
              )}
            </ScrollView>

            <Pressable
              style={s.legalCloseButton}
              onPress={() => setLegalModal(null)}
              accessibilityRole="button"
            >
              <Text style={s.legalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Contact Us modal */}
      <Modal
        visible={contactModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setContactModalOpen(false)}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setContactModalOpen(false)}
        />
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Contact Us</Text>
            <Pressable onPress={() => setContactModalOpen(false)} style={s.modalCloseBtn}>
              <Text style={s.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <Text style={s.modalSubtitle}>
            Have a question or concern? Send us a message and we'll get back to you.
          </Text>

          <Text style={s.modalFieldLabel}>Your Name</Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. John Smith"
            placeholderTextColor={s.modalPlaceholder.color}
            value={contactName}
            onChangeText={setContactName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={s.modalFieldLabel}>Your Email <Text style={s.modalFieldOptional}>(so we can reply)</Text></Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. john@example.com"
            placeholderTextColor={s.modalPlaceholder.color}
            value={contactEmail}
            onChangeText={setContactEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Text style={s.modalFieldLabel}>Message</Text>
          <TextInput
            style={[s.modalInput, s.modalInputMultiline]}
            placeholder="How can we help you?"
            placeholderTextColor={s.modalPlaceholder.color}
            value={contactMessage}
            onChangeText={setContactMessage}
            multiline
            numberOfLines={4}
            returnKeyType="send"
          />

          <Pressable
            style={[s.modalSendBtn, !contactMessage.trim() && s.modalSendBtnDisabled]}
            disabled={!contactMessage.trim()}
            onPress={() => {
              if (!contactMessage.trim()) return;
              const subject = encodeURIComponent('CCW Map — Contact Us');
              const body = encodeURIComponent(
                `Message from: ${contactName.trim() || 'Anonymous'}${contactEmail.trim() ? `\nReply-to: ${contactEmail.trim()}` : ''}\n\n${contactMessage.trim()}`
              );
              const CONTACT = atob('ZGF2aWQ0bmRlcnNvbkBwbS5tZQ==');
              Linking.openURL(`mailto:${CONTACT}?subject=${subject}&body=${body}`);
              setContactMessage('');
              setContactName('');
              setContactEmail('');
              setContactModalOpen(false);
            }}
          >
            <Text style={s.modalSendText}>Send Message</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Settings flyout — only visible when collapsed and triggered */}
      {flyoutOpen && (
        <>
          {/* Backdrop: transparent, covers entire screen, dismisses flyout on press */}
          <Pressable
            style={s.flyoutBackdrop}
            onPress={() => onFlyoutChange?.(false)}
          />

          {/* Flyout panel */}
          <View style={s.flyoutPanel}>
            {/* Flyout header */}
            <View style={s.flyoutHeader}>
              <Text style={s.flyoutTitle}>Settings</Text>
              <Pressable
                style={s.flyoutCloseButton}
                onPress={() => onFlyoutChange?.(false)}
              >
                <Text style={s.flyoutCloseText}>✕</Text>
              </Pressable>
            </View>

            <View style={s.flyoutDivider} />

            {/* Flyout settings content */}
            <ScrollView
              style={s.flyoutScrollArea}
              showsVerticalScrollIndicator={false}
            >
              {renderSettingsContent()}
              <View style={s.flyoutScrollPadding} />
            </ScrollView>
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
    logoIconWrapper: {
      position: 'relative',
      marginRight: 12,
    },
    logoIcon: {
      width: 72,
      height: 72,
      borderRadius: 14,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoWeaponImage: {
      width: 52,
      height: 52,
    },
    weaponChevronBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    weaponChevronText: {
      color: '#ffffff',
      fontSize: 9,
      lineHeight: 10,
    },
    weaponDropdownBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 49,
    },
    weaponDropdown: {
      position: 'absolute',
      top: 104,
      left: 12,
      right: 12,
      maxHeight: 380,
      zIndex: 50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.surfaceLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    weaponDropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    weaponDropdownItemActive: {
      backgroundColor: `${theme.accent}22`,
    },
    weaponDropdownImage: {
      width: 32,
      height: 32,
      marginRight: 10,
    },
    weaponDropdownLabel: {
      flex: 1,
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    weaponDropdownLabelActive: {
      color: theme.text,
      fontWeight: '600',
    },
    weaponDropdownCheck: {
      color: theme.accent,
      fontSize: 14,
      fontWeight: '700',
    },
    weaponDropdownMoreRow: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    weaponDropdownMoreText: {
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 1.2,
    },
    weaponRequestBtn: {
      borderWidth: 1,
      borderColor: theme.accent,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    weaponRequestBtnText: {
      color: theme.accent,
      fontSize: 11,
      fontWeight: '600',
    },

    // Weapon request modal
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalCard: {
      position: 'absolute',
      top: '50%' as any,
      left: '50%' as any,
      width: 300,
      transform: [{ translateX: -150 }, { translateY: -160 }],
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 20,
      zIndex: 999,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    modalTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '700',
    },
    modalCloseBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalCloseText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 14,
    },
    modalSubtitle: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 16,
      marginBottom: 16,
    },
    modalFieldLabel: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      fontSize: 14,
      backgroundColor: theme.surfaceLight,
      marginBottom: 14,
    },
    modalPlaceholder: {
      color: theme.textMuted,
    },
    modalSendBtn: {
      backgroundColor: theme.accent,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 4,
    },
    modalSendBtnDisabled: {
      opacity: 0.4,
    },
    modalSendText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700',
    },
    modalInputMultiline: {
      height: 90,
      textAlignVertical: 'top',
      paddingTop: 10,
    },
    contactUsBtn: {
      alignSelf: 'flex-start',
      marginTop: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.accent,
      borderRadius: 8,
    },
    contactUsBtnText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    modalFieldOptional: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '400',
    },
    logoTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 24,
    },
    // Collapsed header
    headerCollapsed: {
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 12,
      gap: 10,
    },
    logoIconSmall: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoWeaponImageSmall: {
      width: 28,
      height: 28,
    },
    // Collapsed nav
    navSectionCollapsed: {
      paddingHorizontal: 0,
      alignItems: 'center',
    },
    navItemCollapsed: {
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    navIconBoxCollapsed: {
      marginRight: 0,
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
    // Inline state detail
    stateDetailHeader: {
      borderBottomWidth: 0,
    },
    stateDetailTabRow: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingBottom: 8,
    },
    stateDetailTabBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    stateDetailTabBtnActive: {
      borderBottomColor: theme.primary,
    },
    stateDetailTabText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    stateDetailTabTextActive: {
      color: theme.primary,
    },
    stateDetailName: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '700',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
    },
    stateDetailScroll: {
      paddingHorizontal: 14,
      paddingBottom: 20,
    },

    // Inline states list
    statesListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    statesListItemHome: {
      opacity: 0.4,
    },
    statesListItemName: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
    statesListItemCode: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },

    // Footer
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      alignItems: 'center',
      gap: 6,
    },
    footerText: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
    },
    footerLinks: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    footerLink: {
      color: theme.textMuted,
      fontSize: 10,
      textDecorationLine: 'underline',
    },
    footerLinkSep: {
      color: theme.textMuted,
      fontSize: 10,
    },

    // Legal modal
    legalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    legalCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      width: '100%',
      maxWidth: 520,
      maxHeight: '85%' as any,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 20,
    },
    legalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    legalTitle: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
    },
    legalScroll: {
      flex: 1,
    },
    legalScrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 8,
    },
    legalSectionTitle: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    legalBody: {
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 19,
    },
    legalCloseButton: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      alignItems: 'center',
    },
    legalCloseButtonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700',
    },

    // Flyout panel
    flyoutBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      // Extend far to the right to catch taps anywhere outside the flyout
      left: 0,
      right: -2000,
      zIndex: 48,
    },
    flyoutPanel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 64,
      width: 300,
      backgroundColor: theme.surface,
      zIndex: 49,
      borderRightWidth: 1,
      borderRightColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.22,
      shadowRadius: 14,
      elevation: 12,
    },
    flyoutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    flyoutTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '700',
    },
    flyoutCloseButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flyoutCloseText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 16,
    },
    flyoutDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: 20,
    },
    flyoutScrollArea: {
      flex: 1,
    },
    flyoutScrollPadding: {
      height: 32,
    },
  });
}
