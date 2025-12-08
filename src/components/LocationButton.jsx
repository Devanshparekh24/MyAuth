import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../screens/HomeScreen'
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder-reborn';

function LocationButton({ onLocationChange }) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Attendence App needs access to your location',
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

            // Geolocation.getCurrentPosition(

            //     (position) => {
            //         console.log(position, 'position');
            //         console.log('SUCCESS! Got position:', JSON.stringify(position));
            //         const { latitude, longitude, accuracy, speed } = position.coords;
            //         setLocation({ latitude, longitude, accuracy, speed });
            //         setLoading(false);
            //         console.log('Latitude:', latitude, 'Longitude:', longitude, 'Accuracy:', accuracy, 'Speed:', speed);
            //     },
            //     (err) => {
            //         console.error('Geolocation ERROR:', err.code, err.message);

            //         // If timeout (error code 3), try again with cached location
            //         if (err.code === 3) {
            //             console.log('Timeout - trying with cached location');
            //             Geolocation.getCurrentPosition(
            //                 (position) => {
            //                     console.log('SUCCESS with cached! Got position:', JSON.stringify(position));
            //                     const { latitude, longitude, accuracy, speed } = position.coords;
            //                     setLocation({ latitude, longitude, accuracy, speed });
            //                     setLoading(false);
            //                 },
            //                 (retryErr) => {
            //                     console.error('Retry failed:', retryErr.code, retryErr.message);
            //                     setError(`Unable to get location. Please ensure GPS is enabled and try again.`);
            //                     setLoading(false);
            //                 },
            //                 {
            //                     enableHighAccuracy: false,
            //                     timeout: 10000,
            //                     maximumAge: 300000 // Accept location up to 5 minutes old
            //                 }
            //             );
            //         } else {
            //             setError(`Error ${err.code}: ${err.message}`);
            //             setLoading(false);
            //         }
            //     },
            //     {
            //         enableHighAccuracy: false, // Faster, uses network location
            //         timeout: 30000, // 30 seconds
            //         maximumAge: 10000 // Accept location up to 10 seconds old
            //     }
            // );
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log("FAST position:", position);
                    const { latitude, longitude, accuracy, speed } = position.coords;
                    const locationData = { latitude, longitude, accuracy, speed };
                    setLocation(locationData);
                    if (onLocationChange) {
                        onLocationChange(locationData);
                    }
                    getAddressFromCoords(latitude, longitude);
                    setLoading(false);
                },
                (err) => {
                    console.log("ERROR:", err);

                    // Retry with HIGH ACCURACY only if first attempt fails
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log("HIGH ACCURACY position:", position);
                            const { latitude, longitude, accuracy, speed } = position.coords;
                            const locationData = { latitude, longitude, accuracy, speed };
                            setLocation(locationData);
                            if (onLocationChange) {
                                onLocationChange(locationData);
                            }
                            getAddressFromCoords(latitude, longitude);
                            setLoading(false);
                        },
                        (retryErr) => {
                            console.log("Retry failed:", retryErr);
                            setError("Unable to get location. Ensure GPS is ON and try again.");
                            setLoading(false);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 8000,
                            maximumAge: 0,
                            forceRequestLocation: true,
                            showLocationDialog: true,
                        }
                    );
                },
                {
                    enableHighAccuracy: false,   // FASTEST
                    timeout: 4000,               // Don't wait too long
                    maximumAge: 60000,           // Accept cached location up to 1 minute
                }
            );

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('Unexpected error: ' + error.message);
            setLoading(false);
        }
    };

    // Native Reverse Geocoding using react-native-geocoder-reborn (like Android's Geocoder class)
    const getAddressFromCoords = async (lat, lon) => {
        console.log("Calling Native Geocoder with:", lat, lon);
        try {
            const results = await Geocoder.geocodePosition({ lat, lng: lon });
            console.log("Geocoder Response:", JSON.stringify(results));

            if (results && results.length > 0) {
                const addr = results[0];

                // Build exact location string
                let exactLocation = "";
                if (addr.streetNumber) exactLocation += addr.streetNumber + ", ";
                if (addr.streetName) exactLocation += addr.streetName;
                if (!exactLocation && addr.subLocality) exactLocation = addr.subLocality;

                const addressInfo = {
                    exactLocation: exactLocation || "",
                    street: addr.streetName || "",
                    area: addr.subLocality || addr.subAdminArea || "",
                    city: addr.locality || addr.subAdminArea || "",
                    district: addr.subAdminArea || "",
                    state: addr.adminArea || "",
                    country: addr.country || "",
                    pincode: addr.postalCode || "",
                    fullAddress: addr.formattedAddress || ""
                };

                console.log("Setting Address:", addressInfo);
                setAddress(addressInfo);
            } else {
                console.log("No address data found");
                setAddress(null);
            }
        } catch (err) {
            console.log("Reverse Geocoding Error:", err);
            setAddress(null);
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
                    <Text style={localStyles.locationText}>
                        Accuracy: {location.accuracy.toFixed(6)}
                    </Text>
                    <Text style={localStyles.locationText}>
                        Speed: {location.speed.toFixed(6)}
                    </Text>
                </View>
            )}

            {address && (
                <View style={localStyles.addressContainer}>
                    <Text style={localStyles.locationTitle}>🏠 Address Details:</Text>
                    {address.exactLocation ? <Text style={localStyles.locationText}>📍 Exact Location: {address.exactLocation}</Text> : null}
                    {address.area ? <Text style={localStyles.locationText}>🏘️ Area: {address.area}</Text> : null}
                    {address.city ? <Text style={localStyles.locationText}>🌆 City: {address.city}</Text> : null}
                    {address.district ? <Text style={localStyles.locationText}>📍 District: {address.district}</Text> : null}
                    {address.state ? <Text style={localStyles.locationText}>🗺️ State: {address.state}</Text> : null}
                    {address.country ? <Text style={localStyles.locationText}>🌍 Country: {address.country}</Text> : null}
                    {address.pincode ? <Text style={localStyles.locationText}>📮 Pincode: {address.pincode}</Text> : null}
                    {address.fullAddress ? <Text style={localStyles.fullAddressText}>📌 Full Address: {address.fullAddress}</Text> : null}
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
    addressContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
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
    fullAddressText: {
        color: '#1565c0',
        fontSize: 13,
        fontWeight: '400',
        marginTop: 8,
        fontStyle: 'italic',
        lineHeight: 18,
    },
});

export default LocationButton;





