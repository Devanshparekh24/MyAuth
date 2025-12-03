import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { colors } from '../theme/colors';
import LocationButton from '../components/LocationButton';
// import MapView from 'react-native-maps';

const HomeScreen = ({ navigation }) => {



    const handleLogout = () => {
        // In a real app, you might clear session state here
        navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
        });
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'MyAuth needs access to your location ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the Location');
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };


    useEffect(() => {
        requestLocationPermission();
    }, []);


    return (

        <View>


            <View style={styles.buttonContainer}>




                <LocationButton />

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>






        </View>
    );
};

export const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '65%',
    },
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
        // flexDirection: 'column',
        justifyContent: 'flex-end',
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
    },
    buttonContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        paddingVertical: 20
    }


});
export default HomeScreen;  