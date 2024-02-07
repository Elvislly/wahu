---

# React Native Firebase Authentication App

## Overview
This React Native app demonstrates authentication using Firebase Authentication. It includes social login options such as Google and Facebook, as well as phone number authentication. Upon successful authentication, users are navigated to their profile screen, displaying their information.

## Setup Instructions

### 1. Download Source Code
- Download the source code from the project repository.

### 2. Install Node.js
- If not already installed, download and install Node.js from the official website: [Node.js Download](https://nodejs.org/).
- Follow the installation instructions for your operating system.

### 3. Open Terminal/Command Prompt
- Open the terminal or command prompt on your computer.

### 4. Navigate to Project Directory
- Use the `cd` command to navigate to the directory where you downloaded the project source code.

### 5. Install Expo CLI
- Run the following command to install Expo CLI globally:
  ```
  npm install -g expo-cli
  ```

### 6. Install Dependencies
- Run the following command to install project dependencies:
  ```
  npm install
  ```

### 7. Start Expo Server
- Run the following command to start the Expo server:
  ```
  npx expo start
  ```

### 8. Run on Android Device/Emulator
- Install the Expo Go app from the Google Play Store.
- Scan the QR code displayed in the terminal using the Expo Go app.
- The app should load on your Android device/emulator.

### 9. Test Functionality
- Once the app is running on your device/emulator, test the functionality including Google and Facebook sign-in options.
- Verify that the app navigates to the profile screen upon successful authentication.

### 10. Setting Up Firebase
- Create a Firebase project on the Firebase Console.
- Add an Android app to your Firebase project and download the google-services.json - file.
- Go to your Firebase project settings.
- Click on the Android icon to add an Android app.
- Follow the setup instructions and provide your Android package name (e.g., com.- - example.app) and SHA-1 certificate fingerprint.
- Download the google-services.json file provided by Firebase.
- Replace the existing google-services.json file in the project's android/app directory with the one you downloaded from the Firebase Console.

### 11. Setting Up Facebook Authentication

1. Create a Facebook Developer account and log in to the [Facebook Developers](https://developers.facebook.com/) portal.
2. Create a new app by clicking on "My Apps" and then "Add a New App".
3. Choose a display name for your app and click "Create App ID".
4. Follow the setup instructions for your platform (Android).
5. Obtain the Facebook App ID and App Secret:
   - Go to your Facebook app settings.
   - Under the Basic settings, you will find the App ID and App Secret.
6. Configure the OAuth redirect URI:
   - Go to the Facebook Login settings.
   - Add the OAuth redirect URI provided by Firebase. It typically follows the format `https://your-project-id.firebaseapp.com/__/auth/handler`.

### 12. Build and Run the App
- After setting up Firebase and Facebook authentication, build the app using the following command:
  ```
  eas build --profile development --platform android
  ```
- Once the app is built and installed on the device/emulator, start the Expo server by running:
  ```
  npx expo start
  ```
- Scan the QR code displayed in the terminal using the Expo Go app to download and install the app on your device/emulator.

By following these steps, you should be able to download dependencies, set up Firebase authentication, and successfully build and run the app on your Android device or emulator. If you encounter any issues, refer to the Expo documentation or reach out for assistance.