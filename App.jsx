// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AppNavigator } from './src/navigation/AppNavigator';

// function App() {
//     return (
//         <SafeAreaProvider>
//             <AppNavigator />
//         </SafeAreaProvider>
//     );
// }

// export default App;
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
