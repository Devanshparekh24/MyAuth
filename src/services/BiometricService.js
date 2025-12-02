import * as LocalAuthentication from 'expo-local-authentication';

export const BiometricService = {
    async checkBiometrics() {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                return { available: false, type: undefined };
            }

            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            let type = 'Biometrics';
            if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                type = 'FaceID';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                type = 'TouchID';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                type = 'Iris';
            }

            return { available: true, type };
        } catch (error) {
            console.error('Biometrics check failed', error);
            return { available: false };
        }
    },

    async authenticate(promptMessage = 'Confirm your identity') {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                fallbackLabel: 'Use MPIN',
                disableDeviceFallback: true, // We handle fallback manually
                cancelLabel: 'Cancel',
            });
            return result.success;
        } catch (error) {
            console.error('Biometric authentication failed', error);
            return false;
        }
    },
};
