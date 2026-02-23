import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../constants/colors';

const ICON_SIZE = 88;
const ICON_OVERLAP = ICON_SIZE / 2;

export function DisclaimerModal() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
  };

  const s = makeStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={s.overlay}>
        {/* Outer wrapper: icon floats above the card */}
        <View style={s.cardOuter}>
          {/* Card — top padding reserves space for the icon */}
          <View style={s.card}>
            <View style={s.cardTopSpace} />

            <View style={s.divider} />

            {/* Legal disclaimer */}
            <ScrollView
              style={s.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.scrollContent}
            >
              <Text style={s.sectionTitle}>IMPORTANT LEGAL NOTICE</Text>

              <Text style={s.body}>
                This application is provided strictly for{' '}
                <Text style={s.bold}>informational and educational purposes only</Text>.
                The content herein does not constitute legal advice and must not be
                relied upon as a substitute for consultation with a qualified attorney
                or licensed law enforcement professional.
              </Text>

              <Text style={s.body}>
                Concealed carry and firearm laws are highly complex, subject to
                frequent legislative change, and vary significantly across federal,
                state, and local jurisdictions. While we strive to maintain current
                and accurate data,{' '}
                <Text style={s.bold}>
                  we make no warranties — express or implied — regarding the
                  completeness, accuracy, or timeliness
                </Text>{' '}
                of any information displayed within this application.
              </Text>

              <Text style={s.body}>
                <Text style={s.bold}>You are solely and entirely responsible</Text>{' '}
                for knowing, understanding, and complying with all applicable laws
                before carrying a firearm — including those governing transportation,
                permit reciprocity, restricted locations, and use of force. Interstate
                travel with a firearm carries serious legal obligations that no
                application can fully anticipate or replace.
              </Text>

              <Text style={s.body}>
                The developers, contributors, and distributors of this application{' '}
                <Text style={s.bold}>assume no liability</Text> for any legal
                consequences, citations, arrests, or other outcomes arising from
                reliance on the information provided. Always verify current laws
                through official government sources or a licensed firearms attorney
                prior to travel.
              </Text>

              <Text style={s.disclaimer}>
                By selecting "I Understand &amp; Accept" you acknowledge that you have
                read this notice, understand the limitations of this application, and
                agree to use it solely as a general reference at your own risk.
              </Text>
            </ScrollView>

            <Pressable
              style={({ pressed }) => [s.acceptButton, pressed && s.acceptButtonPressed]}
              onPress={handleAccept}
              accessibilityRole="button"
              accessibilityLabel="Accept disclaimer and enter the app"
            >
              <Text style={s.acceptButtonText}>I Understand &amp; Accept</Text>
            </Pressable>
          </View>

          {/* Icon floats centered on the top edge of the card */}
          <View style={s.iconWrapper}>
            <Image
              source={require('../../assets/icon.png')}
              style={s.appIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      paddingTop: 20 + ICON_OVERLAP,
    },
    // Relative container so the icon can be absolutely positioned at its top
    cardOuter: {
      width: '100%',
      maxWidth: 480,
      maxHeight: '90%' as any,
      alignItems: 'center',
    },
    card: {
      width: '100%',
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 24,
    },
    // Spacer inside the card to push content below the floating icon
    cardTopSpace: {
      height: ICON_OVERLAP + 12,
    },
    // Icon positioned centered on the card's top border
    iconWrapper: {
      position: 'absolute',
      top: -ICON_OVERLAP,
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: 22,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
      zIndex: 2,
    },
    appIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.border,
      marginTop: 18,
    },
    scrollArea: {
      width: '100%',
      maxHeight: 320,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      gap: 12,
    },
    sectionTitle: {
      color: theme.accent,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      textAlign: 'center',
      marginBottom: 4,
    },
    body: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 20,
    },
    bold: {
      color: theme.text,
      fontWeight: '700',
    },
    disclaimer: {
      color: theme.textMuted,
      fontSize: 11,
      lineHeight: 17,
      fontStyle: 'italic',
      marginTop: 4,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    acceptButton: {
      width: '100%',
      backgroundColor: theme.accent,
      paddingVertical: 16,
      alignItems: 'center',
    },
    acceptButtonPressed: {
      opacity: 0.85,
    },
    acceptButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
}
