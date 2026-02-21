import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function StackLayout() {
  const { theme, themeName } = useTheme();

  return (
    <>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '700' },
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
