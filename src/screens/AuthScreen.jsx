import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet, Text } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { BackHandler } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();

const AuthScreen = ({ navigation }) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);


  console.log('App is running');


  useEffect(() => {
    rnBiometrics.isSensorAvailable()
      .then(({ available, biometryType }) => {
        if (available && biometryType) {
          setBiometricAvailable(true);
          handleBiometricAuth();
          console.log('Biometric available');


        } else {
          setBiometricAvailable(false);
          console.log('Biometric not available');
        }
      });
  }, []);

  const handleBiometricAuth = () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Use Finger to open app' })
      .then(result => {
        if (result.success) {
          // Biometric authentication successful
          navigation.replace('Home'); // Navigate to main app
        } else {
          // Alert.alert('Authentication Cancelled', 'Please login with MPIN');
          BackHandler.exitApp();
        }
      });
  };

  const handleMPINAuth = () => {
    // Implement your MPIN login logic here
    // After success:
    navigation.replace('Home');
  };

  return (



  
    <View style={styles.container}>
      {!biometricAvailable && (
        <>
          <Text style={styles.text}>Biometric not available.</Text>
          <Button title="Login with MPIN" onPress={handleMPINAuth} />
        </>
      )}


      {biometricAvailable && (
        <Button title="Login with Biometric" onPress={handleBiometricAuth} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, marginBottom: 20 }
});

export default AuthScreen;
