import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { WebAuth } from "../../config/firebaseConfig";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from '@react-native-firebase/auth';

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const onFacebookAuthStateChanged = (user: FirebaseAuthTypes.User | null | any | Error) => {    
    if (initializing) setInitializing(false);
    setLoading(false); // Hide loading indicator
    if (user) {
      navigate("Home")
    }
  };
  
  // Handle Phone number authentication state changes
  const onDefaultAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (initializing) setInitializing(false);
    if(user) {
      navigate("Home")
    }
  };
  
  useEffect(() => {
    const phoneSubscriber = auth().onAuthStateChanged(onDefaultAuthStateChanged);
    const facebookSubscriber = WebAuth.onAuthStateChanged(onFacebookAuthStateChanged);
    return () => {
      phoneSubscriber();
      facebookSubscriber();
    };
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
     {loading || initializing ? 
      <View >
        <ActivityIndicator size={50}/>
      </View> 
      : 
      <View>
      <ImageBackground
          style={{
            height: height / 2,
          }}
          resizeMode="contain"
          source={require("../../assets/images/welcome-img.png")}
        />
        <View
          style={{
            padding: Spacing * 2,
          }}
        >
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
              Get Started
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              Earn 3x more with Wahu. Sign up to explore delivery job opportunities and commute conveniently
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate("Register")}
            style={{
              padding: Spacing * 2,
              backgroundColor: Colors.text,
              marginVertical: Spacing * 3,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                color: Colors.onPrimary,
                textAlign: "center",
                fontSize: FontSize.small,
              }}
            >
              Sign up with phone number
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Login")}
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
              Already have an account ?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      }
    </SafeAreaView>
  );
};

export default WelcomeScreen;
