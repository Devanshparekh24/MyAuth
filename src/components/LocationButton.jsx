import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React from 'react'
import { styles } from '../screens/HomeScreen'
import Geolocation from 'react-native-geolocation-service';
function LocationButton() {

    const getCurrLocation = () => {
        try {
            console.log('start location');
            
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('position',position);
                    console.log('end location');
                },
                (error) => {
                    // See error code charts below.
                    console.log('error',error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                
            );

        } catch (error) {
            console.error(error, 'handleLocation');
        }
    }



    return (
        <View>

            <TouchableOpacity style={styles.button} onPress={getCurrLocation}>
                <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LocationButton;


