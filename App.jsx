import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
    return (
        <SafeAreaProvider>
            <AppNavigator />
        </SafeAreaProvider>
    );
}

export default App;


// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AuthScreen from './src/screens/AuthScreen';
// import HomeScreen from './src/screens/HomeScreen';
// // import MpinSetupScreen from './src/screens/MpinSetupScreen';
// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: true }}>
//         <Stack.Screen name="Auth" component={AuthScreen}  screenOptions={{ headerShown: true }}/>
//         <Stack.Screen name="Home" component={HomeScreen} screenOptions={{ headerShown: true }} />
//         {/* <Stack.Screen name="MpinSetup" component={MpinSetupScreen} /> */}
//       </Stack.Navigator>  
//     </NavigationContainer>
//   );
// }
