import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { Platform } from 'react-native';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

let fontDefaultsApplied = false;

function StackLayout() {
  const { theme, themeName } = useTheme();
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!fontDefaultsApplied) {
    const appFontFamily = 'JetBrainsMono_400Regular';

    setCustomText({
      style: { fontFamily: appFontFamily },
    });
    setCustomTextInput({
      style: { fontFamily: appFontFamily },
    });

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'ccw-global-jetbrains-font';
      if (!document.getElementById(styleId)) {
        const styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.innerHTML =
          '#root, #root * { font-family: "JetBrainsMono_400Regular", "JetBrains Mono", monospace !important; font-optical-sizing: auto; }';
        document.head.appendChild(styleTag);
      }
    }

    fontDefaultsApplied = true;
  }

  return (
    <>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'CCW Reciprocity Map',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="state/[code]"
          options={{
            title: 'State Details',
            headerBackTitle: 'Map',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}
