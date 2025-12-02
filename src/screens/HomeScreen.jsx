import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { StorageService } from '../services/StorageService';

 const HomeScreen = ({ navigation }) => {
    const handleLogout = () => {
        // In a real app, you might clear session state here
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleResetMpin = async () => {
        await StorageService.clearMpin();
        navigation.reset({
            index: 0,
            routes: [{ name: 'MpinSetup' }],
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Home!</Text>
            <Text style={styles.subtitle}>You are securely authenticated.</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleResetMpin}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Reset MPIN</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
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
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
    }
});
export default HomeScreen;  