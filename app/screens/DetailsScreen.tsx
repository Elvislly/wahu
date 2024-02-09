import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth'
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Spacing from '../../constants/Spacing';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';
import ToastAlert from '../components/ToastAlert';
import Font from '../../constants/Font';
import AppTextInput from '../components/AppTextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebAuth } from '../../config/firebaseConfig';
  
type Props = NativeStackScreenProps<RootStackParamList, "Details">;

const DetailsScreen: React.FC<Props> = ({ navigation: { navigate }, route }) => {
  const [initializing, setInitializing] = useState(true);
  const [phoneNumberUser, setPhoneNumberUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [facebookUser, setFacebookUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const { uuid,firstName: first, lastName: last, email: mail, photoURL } = route.params ?? {};
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  /// Handle Facebook authentication state changes
  const onFacebookAuthStateChanged = (user: FirebaseAuthTypes.User | null | any | Error) => {
    if (user) {
      setFacebookUser(user);
      console.log(user);
      
      if (initializing) setInitializing(false);
    }
  };

  // Handle Phone number authentication state changes
  const onDefaultAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setPhoneNumberUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const phoneSubscriber = auth().onAuthStateChanged(onDefaultAuthStateChanged);
    const facebookSubscriber = WebAuth.onAuthStateChanged(onFacebookAuthStateChanged);
    return () => {
      phoneSubscriber();
      facebookSubscriber();
    };
  }, []);
  

  const saveDetails = async () => {
    try {
      setLoading(true);
      const userData = phoneNumberUser ?? facebookUser;
      if (userData) {
        await firestore().collection("users").doc(uuid).set({
          firstName: firstName || first,
          lastName: lastName || last,
          email: email || mail,
          phoneNumber: phoneNumberUser?.phoneNumber || mobile,
          photoURL: photoURL || ""
        });
        setLoading(false);
        navigate("Home");
      } else {
        setMessage("Could not finish your account, try again..");
        setOpenToast(true);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error Inserting User Details: ", error);
      setMessage("Could not finish your account, try again..");
      setOpenToast(true);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ padding: Spacing * 2, height: "100%" }}>
          <ToastAlert message={message} visible={openToast} />
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: FontSize.xLarge, color: Colors.text, fontFamily: Font["poppins-bold"], marginVertical: Spacing * 3 }}>Almost Done</Text>
            <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: FontSize.large, maxWidth: "60%", textAlign: "center" }}>Finish setting up your account!</Text>
          </View>
          <View style={{ marginVertical: Spacing * 3 }}>
            {phoneNumberUser?.phoneNumber ? (
              <>
                <AppTextInput value={firstName} placeholder="First name" onChangeText={(value) => setFirstName(value)} />
                <AppTextInput value={lastName} placeholder="Last Name" onChangeText={(value) => setLastName(value)} />
                <AppTextInput value={email} placeholder="Email address" onChangeText={(value) => setEmail(value)} />
              </>
            ) : (
              <AppTextInput value={mobile} placeholder="Phone number" onChangeText={(value) => setMobile(value)} />
            )}
          </View>
          <TouchableOpacity
            onPress={() => { saveDetails() }}
            style={{
              padding: Spacing * 2,
              backgroundColor: loading ? Colors.darkText : Colors.text,
              marginVertical: Spacing * 3,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: Spacing },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}>
            <Text style={{ fontFamily: Font["poppins-semiBold"], color: Colors.onPrimary, textAlign: "center", fontSize: FontSize.medium }}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetailsScreen;

