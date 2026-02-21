import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.background },
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
