import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const BiometricService = {
    async checkBiometrics() {
        try {
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            return { available, type: biometryType };
        } catch (error) {
            console.error('Biometrics check failed', error);
            return { available: false };
        }
    },

    async authenticate(promptMessage = 'Confirm your identity') {
        try {
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage,
                cancelButtonText: 'Cancel',
            });
            return success;
        } catch (error) {
            console.error('Biometric authentication failed', error);
            return false;
        }
    },
};
