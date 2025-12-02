import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'com.myauth.mpin';
const USERNAME = 'user_mpin';

export const StorageService = {
    async setMpin(mpin) {
        try {
            // Store the MPIN securely
            await Keychain.setGenericPassword(USERNAME, mpin, { service: SERVICE_NAME });
            return true;
        } catch (error) {
            console.error('Error setting MPIN:', error);
            return false;
        }
    },

    async getMpin() {
        try {
            const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
            if (credentials) {
                return credentials.password;
            }
            return null;
        } catch (error) {
            console.error('Error getting MPIN:', error);
            return null;
        }
    },

    async hasMpin() {
        const mpin = await this.getMpin();
        return mpin !== null;
    },

    async clearMpin() {
        try {
            await Keychain.resetGenericPassword({ service: SERVICE_NAME });
            return true;
        } catch (error) {
            console.error('Error clearing MPIN:', error);
            return false;
        }
    },
};
