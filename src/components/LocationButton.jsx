import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../screens/HomeScreen'
import Geolocation from '@react-native-community/geolocation';

function LocationButton() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'MyAuth needs access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Location permission granted');
                    return true;
                } else {
                    console.log('Location permission denied');
                    setError('Permission denied');
                    return false;
                }
            } catch (err) {
                console.error('Permission error:', err);
                setError('Permission error');
                return false;
            }
        }
        return true;
    };

    const getCurrLocation = async () => {
        setLoading(true);
        setError(null);
        setLocation(null);
        console.log('Button clicked - getting location');

        try {
            const hasPermission = await requestLocationPermission();

            if (!hasPermission) {
                setLoading(false);
                return;
            }

            console.log('Calling Geolocation.getCurrentPosition');

            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('SUCCESS! Got position:', JSON.stringify(position));
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setLoading(false);
                    console.log('Latitude:', latitude, 'Longitude:', longitude);
                },
                (err) => {
                    console.error('Geolocation ERROR:', err.code, err.message);

                    // If timeout (error code 3), try again with cached location
                    if (err.code === 3) {
                        console.log('Timeout - trying with cached location');
                        Geolocation.getCurrentPosition(
                            (position) => {
                                console.log('SUCCESS with cached! Got position:', JSON.stringify(position));
                                const { latitude, longitude } = position.coords;
                                setLocation({ latitude, longitude });
                                setLoading(false);
                            },
                            (retryErr) => {
                                console.error('Retry failed:', retryErr.code, retryErr.message);
                                setError(`Unable to get location. Please ensure GPS is enabled and try again.`);
                                setLoading(false);
                            },
                            {
                                enableHighAccuracy: false,
                                timeout: 10000,
                                maximumAge: 300000 // Accept location up to 5 minutes old
                            }
                        );
                    } else {
                        setError(`Error ${err.code}: ${err.message}`);
                        setLoading(false);
                    }
                },
                {
                    enableHighAccuracy: false, // Faster, uses network location
                    timeout: 30000, // 30 seconds
                    maximumAge: 10000 // Accept location up to 10 seconds old
                }
            );

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('Unexpected error: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <View style={localStyles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={getCurrLocation}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Getting Location...' : 'Get Location'}
                </Text>
            </TouchableOpacity>

            {location && (
                <View style={localStyles.locationContainer}>
                    <Text style={localStyles.locationTitle}>📍 Your Location:</Text>
                    <Text style={localStyles.locationText}>
                        Latitude: {location.latitude.toFixed(6)}
                    </Text>
                    <Text style={localStyles.locationText}>
                        Longitude: {location.longitude.toFixed(6)}
                    </Text>
                </View>
            )}

            {error && (
                <View style={localStyles.errorContainer}>
                    <Text style={localStyles.errorText}>
                        ❌ {error}
                    </Text>
                </View>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    locationContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    locationTitle: {
        color: '#2e7d32',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationText: {
        color: '#2e7d32',
        fontSize: 14,
        fontWeight: '500',
        marginVertical: 2,
    },
    errorContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        color: '#c62828',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default LocationButton;
