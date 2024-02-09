import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore, { FirebaseFirestoreTypes }  from '@react-native-firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import FontSize from '../../constants/FontSize';
import Font from '../../constants/Font';
import { MaterialIcons } from '@expo/vector-icons';
import { WebFirebase } from '../../config/firebaseConfig';

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
export type UserData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUrl: string;
    // Add more fields as needed
};
const HomeScreen: React.FC<Props> = () => {
    const navigation = useNavigation()
    const [userData, setUserData] = useState<UserData | FirebaseFirestoreTypes.DocumentData | undefined | null>(null);
    const [user, setUser] = useState(false)
    const [loading, setloading] = useState(false)

    //Retrieve the document from Firestore
    const fetchUserData = async (docId: string) => {
        try {
         setloading(true)   
         const userRef = firestore().collection('users').doc(docId);
         const docSnapshot = await userRef.get();
         setloading(false)
        if (docSnapshot.exists) {
            setUserData(docSnapshot.data());
        } else {
            console.log("Document does not exist");
        }
        } catch (error) {
            setloading(false)
            console.error("Error fetching document:", error);
        }
    };

    const OnFBAuthStateChanged = (user: FirebaseAuthTypes.User | null | any | Error) => {
        
        if (user) {
        console.log("-------------OnFBAuthStateChanged---------");
        fetchUserData(user.uid)
        }
      };
    
      useEffect(() => {
        const subscriber = WebFirebase.auth().onAuthStateChanged(OnFBAuthStateChanged)
        return subscriber; 
      }, [])
     const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        if (user) {
            console.log("---------onAuthStateChanged-----");
            setUser(true)
            fetchUserData(user.uid).catch(err => console.log(err)
            )
        }
      }
    
      useEffect(() => {
          const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
          return subscriber; // unsubscribe on unmount
      }, []);
    
    //Signout
    const signOutFB = async() => {
        try {
          await WebFirebase.auth().signOut()
        } catch (error) {
          console.log(error);     
        }
      }
    const signOut = async() => {
        try {
          if(user) {
            await auth().revokeToken
            await auth().signOut();            
          } else {
            signOutFB()
          }

        // Reset Navigation
        navigation.reset({
            index: 0,
            routes: [{name: 'Welcome'}]
        });
        } catch (error) {
            console.log("Error signingOut: ", error);
            
        }
    }
    const capitalizeFirstLetter = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
  return (
    <SafeAreaView style = {{backgroundColor: Colors.lightPrimary, flex: 1 }}>
        <StatusBar/>
        <View style = {{padding: Spacing, display: 'flex', alignItems: 'flex-end'}}>
            <TouchableOpacity
                onPress={() => {
                    signOut()
                }}
                style={{
                padding: Spacing,
                backgroundColor: Colors.background,
                borderRadius: Spacing / 2,
                marginHorizontal: Spacing,
                width: '20%',
                alignItems: 'center',
                borderStyle: 'solid',
                borderColor: Colors.gray,
                borderWidth: 2,
                }}
            >
            <FontAwesome name="sign-out" color={Colors.text} size={Spacing * 2} />
            </TouchableOpacity>
        </View>
       <View style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
                    style={styles.circleButton}
                    onPress={() => {
                        // Add your onPress logic here
                    }}
                >
                <ImageBackground
                    style={{
                        height: 60,
                        width: 60
                        // height: height / 2.5,
                    } }
                    resizeMode="contain"
                    source={require("../../assets/images/welcome-img.png")}
                    />
            </TouchableOpacity>
            <Text style ={{fontFamily: Font['poppins-semiBold'], padding: Spacing, color: Colors.darkText}}>{ userData ? capitalizeFirstLetter(userData.firstName.trim()) : 'xxxx'} {userData ?  capitalizeFirstLetter(userData?.lastName.trim()) : 'xxx'}</Text>
       </View>
       <View style={{marginTop: Spacing* 3}}>
            <Text style={{fontFamily: Font['poppins-semiBold'], fontSize: FontSize.medium, marginLeft: Spacing * 2}}>Bio</Text>
            <View style={{margin: Spacing, borderRadius: Spacing, backgroundColor: Colors.background}}>
            <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={
                    {
                        fontFamily: Font["poppins-regular"],
                        fontSize: FontSize.small,
                        padding: Spacing,
                    }
                }>{loading ? "xxxxxxxx@xxxxx.com" : userData?.email}</Text>
                <MaterialIcons name="navigate-next" size={FontSize.medium} color= {Colors.text} />
            </TouchableOpacity>
            <Text style={{
                height: 1, // Height of the divider
                backgroundColor: Colors.gray, // Color of the divider
            }}></Text>
            <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={
                    {
                        fontFamily: Font["poppins-regular"],
                        fontSize: FontSize.small,
                        padding: Spacing,
                    }
                }>{loading ? "+233xxxxxxx" :userData?.phoneNumber}</Text>
                <MaterialIcons name="navigate-next" size={FontSize.medium} color= {Colors.text} />
            </TouchableOpacity>
        </View>
       </View>
    </SafeAreaView>
  )
}

export default HomeScreen
const styles = StyleSheet.create({
    circleButton: {
      padding: 16,
      backgroundColor: Colors.background, 
      borderRadius: 100, 
      width: 100, 
      height: 100, 
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2, 
      borderColor: Colors.gray, 
    },
    buttonText: {
      fontSize: FontSize.large,
      color: Colors.primary,
      fontFamily: Font['poppins-semiBold']

    },
  });
   