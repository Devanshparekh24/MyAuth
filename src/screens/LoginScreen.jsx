import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { StorageService } from '../services/StorageService';
import { BiometricService } from '../services/BiometricService';

export const LoginScreen = ({ navigation }) => {
    const [mpin, setMpin] = useState('');
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        const { available, type } = await BiometricService.checkBiometrics();
        setIsBiometricAvailable(available);
        if (available) {
            console.log('Biometry Type:', type); // Debug log
            handleBiometricLogin();
        } else {
            console.log('Biometrics not available');
        }
    };

    const handleBiometricLogin = async () => {
        const success = await BiometricService.authenticate();
        if (success) {
            navigation.replace('Home');
        }
    };

    const handleMpinChange = async (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setMpin(numericText);

        if (numericText.length === 4) {
            setIsLoading(true);
            // Small delay to let UI update
            setTimeout(async () => {
                const storedMpin = await StorageService.getMpin();
                if (storedMpin === numericText) {
                    navigation.replace('Home');
                } else {
                    Alert.alert('Error', 'Invalid MPIN');
                    setMpin('');
                }
                setIsLoading(false);
            }, 100);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your MPIN to login</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.hiddenInput}
                    keyboardType="numeric"
                    maxLength={4}
                    value={mpin}
                    onChangeText={handleMpinChange}
                    autoFocus={!isBiometricAvailable} // Only autofocus if bio not running immediately
                />
                <View style={styles.dotsContainer}>
                    {[0, 1, 2, 3].map((index) => {
                        const isFilled = index < mpin.length;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    isFilled && styles.dotFilled,
                                    index === mpin.length && styles.dotActive
                                ]}
                            />
                        );
                    })}
                </View>
            </View>

            {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />}

            {isBiometricAvailable && (
                <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
                    <Text style={styles.biometricButtonText}>Use Biometrics</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 40,
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    hiddenInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: colors.primary,
    },
    dotActive: {
        borderColor: colors.primaryDark,
        transform: [{ scale: 1.2 }],
    },
    biometricButton: {
        marginTop: 20,
        padding: 15,
    },
    biometricButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});
