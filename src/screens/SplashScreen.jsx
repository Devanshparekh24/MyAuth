import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { StorageService } from '../services/StorageService';

export const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const hasMpin = await StorageService.hasMpin();

            // Simulate a small delay for branding if needed, or just go
            setTimeout(() => {
                if (hasMpin) {
                    navigation.replace('Login');
                } else {
                    navigation.replace('MpinSetup');
                }
            }, 1000);
        } catch (error) {
            console.error('Auth check failed', error);
            // Fallback to setup if something is weird
            navigation.replace('MpinSetup');
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
