import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import LocationButton from './src/components/LocationButton';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Auth" component={AuthScreen}  screenOptions={{ headerShown: true }}/>
        <Stack.Screen name="Home" component={HomeScreen} screenOptions={{ headerShown: true }} />
        <Stack.Screen name="Location" component={LocationButton} screenOptions={{ headerShown: true }} />
      </Stack.Navigator>  
    </NavigationContainer>
  );
}
