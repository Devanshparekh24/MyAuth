import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { StorageService } from '../services/StorageService';

export const MpinSetupScreen = ({ navigation }) => {
    const [mpin, setMpin] = useState('');
    const [confirmMpin, setConfirmMpin] = useState('');
    const [step, setStep] = useState('enter'); // 'enter' | 'confirm'

    const handleMpinChange = (text) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');

        if (step === 'enter') {
            setMpin(numericText);
            if (numericText.length === 4) {
                setStep('confirm');
            }
        } else {
            setConfirmMpin(numericText);
            if (numericText.length === 4) {
                validateAndSave(numericText);
            }
        }
    };

    const validateAndSave = async (confirmation) => {
        if (mpin === confirmation) {
            const success = await StorageService.setMpin(mpin);
            if (success) {
                Alert.alert('Success', 'MPIN set successfully', [
                    { text: 'OK', onPress: () => navigation.replace('Home') }
                ]);
            } else {
                Alert.alert('Error', 'Failed to save MPIN');
                reset();
            }
        } else {
            Alert.alert('Error', 'MPINs do not match. Please try again.');
            reset();
        }
    };

    const reset = () => {
        setMpin('');
        setConfirmMpin('');
        setStep('enter');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {step === 'enter' ? 'Set your MPIN' : 'Confirm your MPIN'}
            </Text>
            <Text style={styles.subtitle}>
                {step === 'enter'
                    ? 'Enter a 4-digit PIN to secure your account'
                    : 'Re-enter the 4-digit PIN to confirm'}
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.hiddenInput}
                    keyboardType="numeric"
                    maxLength={4}
                    value={step === 'enter' ? mpin : confirmMpin}
                    onChangeText={handleMpinChange}
                    autoFocus
                />
                <View style={styles.dotsContainer}>
                    {[0, 1, 2, 3].map((index) => {
                        const currentVal = step === 'enter' ? mpin : confirmMpin;
                        const isFilled = index < currentVal.length;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    isFilled && styles.dotFilled,
                                    // Highlight current input position
                                    index === currentVal.length && styles.dotActive
                                ]}
                            />
                        );
                    })}
                </View>
            </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0, // Hide the actual input but keep it touchable
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
});
