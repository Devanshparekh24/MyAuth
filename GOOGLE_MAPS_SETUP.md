# Google Maps Setup Guide for React Native

## Steps to Get Google Maps API Key:

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing one)

   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it (e.g., "MyAuth Maps")

3. **Enable Google Maps SDK for Android**

   - Go to "APIs & Services" > "Library"
   - Search for "Maps SDK for Android"
   - Click on it and press "Enable"

4. **Create API Key**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

5. **Restrict the API Key** (Recommended for security)

   - Click on the API key you just created
   - Under "Application restrictions", select "Android apps"
   - Click "Add an item"
   - Add your package name: `com.myauth`
   - Get your SHA-1 fingerprint by running:
     ```
     cd android
     ./gradlew signingReport
     ```
   - Add the SHA-1 fingerprint to the restriction

6. **Add API Key to Your App**
   - Open: `android/app/src/main/AndroidManifest.xml`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key

## Current Status:

✅ react-native-maps installed
✅ AndroidManifest.xml configured with permissions
✅ MapView component added to HomeScreen
✅ Location permissions requested
✅ LocationButton integrated with map updates

## Next Steps:

1. Get your Google Maps API key from Google Cloud Console
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in AndroidManifest.xml with your actual key
3. Rebuild the app: `npm run android`
4. Test the map and location features

## File Locations:

- HomeScreen with Map: `src/screens/HomeScreen.jsx`
- LocationButton: `src/components/LocationButton.jsx`
- AndroidManifest: `android/app/src/main/AndroidManifest.xml`
