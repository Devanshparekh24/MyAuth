import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet, Text } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const AuthScreen = ({ navigation }) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);


  console.log('App is running Raj');


  useEffect(() => {
    rnBiometrics.isSensorAvailable()
      .then(({ available, biometryType }) => {
        if (available && biometryType) {
          setBiometricAvailable(true);
          handleBiometricAuth();
        } else {
          setBiometricAvailable(false);
        }
      });
  }, []);

  const handleBiometricAuth = () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Authenticate to open app' })
      .then(result => {
        if (result.success) {
          // Biometric authentication successful
          navigation.replace('Home'); // Navigate to main app
        } else {
          Alert.alert('Authentication Cancelled', 'Please login with MPIN');
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
          <Text style={styles.text}>Biometric not available. Use MPIN to login.</Text>
          <Button title="Login with MPIN" onPress={handleMPINAuth} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, marginBottom: 20 }
});

export default AuthScreen;
