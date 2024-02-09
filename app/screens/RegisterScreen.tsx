import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spacing from "../../constants/Spacing";
import { RootStackParamList } from "../../types";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import AppTextInput from "../components/AppTextInput";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ToastAlert from "../components/ToastAlert";
import AppNumberInput from "../components/AppNumberInput";
import { WebFirebase } from "../../config/firebaseConfig";
import { FacebookAuthProvider, getAuth, signInWithCredential } from "firebase/auth"
import { LoginManager, AccessToken   } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [openToast, setOpenToast] = useState(false)
// Set an initializing state whilst Firebase connects
const [initializing, setInitializing] = useState(true);
const signInWithFB = async() => {
  try {
    setLoading(true)
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      setLoading(false)
      return
    }
  
    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      return
    }

  // Create a Firebase credential with the AccessToken
  const auth = getAuth()
  const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  await signInWithCredential(auth, facebookCredential)
  .then(async(data) => {
    const useDocument = await firestore()
    .collection("users")
    .doc(data?.user.uid)
    .get()
    setLoading(false)
    if (useDocument.exists) {
        // User already exists, navigate to Home Screen 
        navigate('Home')
        //  user?.uid && fetchUserData(user?.uid)
    } else {
        // User is new, navigate to Home Detaisls Screen         
        navigate("Details", {uuid: data.user.uid, phoneNumber: data.user.phoneNumber, firstName: data.user.displayName?.split(" ")[0], lastName: data.user.displayName?.split(" ")[1], email: data.user.email,photoURL: data.user.photoURL})
    }
  })
  setLoading(false)
  } catch (error) {
    console.log(error);
    setMessage("Error signing up")
    setOpenToast(true)
    setLoading(false)
    
  }
}

const signInWithPhoneNumber = async () => {  
  const { value: formattedPhoneNumber, error } = formattedNumber(phoneNumber);

    if (phoneNumber == "" || error || formattedPhoneNumber.length < 12) {
      setMessage("Invalid phone number")
      setOpenToast(true)
      return
    }   
  try {
    setLoading(true)
     const confrimation = await auth().signInWithPhoneNumber(formattedPhoneNumber)
     setConfirm(confrimation)
     setLoading(false)
  } catch (error) {
     console.log("Error sending code: ",error);
     setMessage("Error sending code")
     setOpenToast(true)
     setLoading(false)
  }
}

const onFacebookAuthStateChanged = (user: FirebaseAuthTypes.User | null | any | Error) => {
  if (initializing) setInitializing(false);
  if (user && phoneNumber) {
    setLoading(true)
  }
};

// Handle Phone number authentication state changes
const onDefaultAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
  if (initializing) setInitializing(false);
  if(user) {
    console.log("USERS ID,", user?.uid);
    const useDocument = await firestore()
    .collection("users")
    .doc(user?.uid)
    .get()
    setLoading(false)
     if (useDocument.exists) {
         // User already exists, navigate to Home Screen 
         navigate('Home')
     } else {
        // User is new, navigate to Home Detaisls Screen 
        navigate("Details", {uuid: user?.uid, phoneNumber: phoneNumber, firstName: user!.displayName?.split(" ")[0], lastName: user!.displayName?.split(" ")[1], email: user!.email, photoURL: user.photoURL})
     } 
  }
};

useEffect(() => {
  const phoneSubscriber = auth().onAuthStateChanged(onDefaultAuthStateChanged);
  const facebookSubscriber = WebFirebase.auth().onAuthStateChanged(onFacebookAuthStateChanged);
  return () => {
    phoneSubscriber();
    facebookSubscriber();
  };
}, []);

const confirmCode = async() => {
  if ( code == "") {
    setMessage("Enter SMS verification code")
    setOpenToast(true)
    return
  }
  try {
      const userCredentials = await confirm?.confirm(code)
      const user = userCredentials?.user 

      //Check if user is new or already exists
      setLoading(true)
      const useDocument = await firestore()
      .collection("users")
      .doc(user?.uid)
      .get()
      setLoading(false)
       if (useDocument.exists) {
           // User already exists, navigate to Home Screen 
           navigate('Home')
       } else {
          // User is new, navigate to Home Detaisls Screen 
          if(user) {
            navigate("Details", {uuid: user?.uid, phoneNumber: phoneNumber, firstName: user!.displayName?.split(" ")[0], lastName: user!.displayName?.split(" ")[1], email: user!.email, photoURL: user.photoURL})
          }
       }
  } catch (error) {
      console.log("Invalid Code: ", error);
      setMessage("Invalid Code")
      setOpenToast(true)
  }
}

GoogleSignin.configure({
  webClientId: '135083071812-b3mrghk0ns991gsclbk1euud3ba8mb1u.apps.googleusercontent.com',
});

const signInwithGoogle = async() => {

  try {
    setLoading(true)
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
  return  auth().signInWithCredential(googleCredential)
  
  } catch (error) {
    console.log(error);
    setLoading(false)
    setMessage("Error signing in")
    setOpenToast(true)
  }

}
if (initializing) return null;
  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            padding: Spacing * 2,
            height: "100%"
          }}
        >
        <ToastAlert message={message} visible={openToast}/>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.text,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Register here
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "60%",
              textAlign: "center",
            }}
          >
            Sign up with wahu today!
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
         {confirm ?
          <>
          <AppTextInput keyboardType="number-pad" value={code} placeholder="Enter code" onChangeText={(value) => setCode(value)}/>
          <Text style = {{fontSize: FontSize.small, fontFamily: Font['poppins-regular'], textAlign: 'center'}}>Please enter SMS verification code</Text>
          </>
          :
          <AppNumberInput keyboardType="phone-pad" value={phoneNumber} placeholder="Phone Number" onChangeText={(value) => setPhoneNumber(value)}/>
         }
        </View>
        <TouchableOpacity
          onPress={() => {
            if(loading) return
            if(confirm) {
              confirmCode()
            } else {
              signInWithPhoneNumber()
            }

          }}
          style={{
            padding: Spacing * 2,
            backgroundColor: loading ? Colors.darkText : Colors.text,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing ,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          {loading && <ActivityIndicator color={Colors.gray} style ={{marginRight: Spacing/ 1.8}} />}
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: Colors.onPrimary,
              textAlign: "center",
              fontSize: FontSize.medium,
            }}
          >
            {loading ?  'Please wait' : confirm && !loading ? 'Confirm code' : 'Sign up'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if(loading) return
            navigate("Login")
          }}
          style={{
            padding: Spacing,
          }}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: Colors.text,
              textAlign: "center",
              fontSize: FontSize.small,
            }}
          >
            Already a member ?
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              color: Colors.primary,
              textAlign: "center",
              fontSize: FontSize.small,
            }}
          >
            Or continue with
          </Text>

          <View
            style={{
              marginTop: Spacing,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if(loading) return
                signInwithGoogle()
              }}
              
              style={{
                padding: Spacing,
                backgroundColor: Colors.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
                width: '20%',
                alignItems: 'center'
              }}
            >
              <Ionicons
                name="logo-google"
                color={Colors.text}
                size={Spacing * 2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if(loading) return
                signInWithFB()
              }}
              style={{
                padding: Spacing,
                backgroundColor: Colors.gray,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
                width: '20%',
                alignItems: 'center'
              }}
            >
              <Ionicons
                name="logo-facebook"
                color={Colors.text}
                size={Spacing * 2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export const formattedNumber = (number: string): { value: string, error: boolean } => {
  // Trim whitespace from the input number
  const trimmedNumber = number.trim();
  
  // Check if the number is not empty
  if (trimmedNumber !== '') {
    // Check if the first character of the trimmed number is '0'
    if (trimmedNumber.charAt(0) === '0') {
      // Replace the '0' with '+233' and return the formatted number
      const formatted = '+233' + trimmedNumber.slice(1);

      // Check if the formatted number has length 12
      if (formatted.length === 12) {
        // Return the formatted number with no error
        return { value: formatted, error: false };
      } else {
        // Return error if the formatted number doesn't have length 12
        return { value: '', error: true };
      }
    } else {
      // Prepend '+233' directly to the number
      const formatted = '+233' + trimmedNumber;
      console.log(formatted);
      
      // Check if the formatted number has length 12
      if (formatted.length === 13) {
        // Return the formatted number with no error
        return { value: formatted, error: false };
      } else {
        // Return error if the formatted number doesn't have length 12
        return { value: '', error: true };
      }
    }
  } else {
    // Return error if the number is empty
    return { value: '', error: true };
  }
};


export default RegisterScreen;

const styles = StyleSheet.create({});
