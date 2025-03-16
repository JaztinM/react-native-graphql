import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import client from '@/scripts/apolloClient';
export default function RootLayout() {

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="messages" />
        <Stack.Screen
          name="+not-found"
        />
      </Stack>
    </ApolloProvider>
  );
}