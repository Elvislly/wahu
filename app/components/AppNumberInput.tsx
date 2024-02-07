import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import FontSize from "../../constants/FontSize";
import Spacing from "../../constants/Spacing";

const AppNumberInput: React.FC<TextInputProps> = ({ ...otherProps }) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.countryCode}>+233</Text>
      </View>
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.darkText}
        style={[
          styles.textInput,
        ]}
        {...otherProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: Spacing,
    borderRadius: Spacing,
    paddingVertical: Spacing 


  },
  countryCode: {
    textAlign: "center",
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
  },
  textInput: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    borderRadius: Spacing,
    marginVertical: Spacing,
    marginHorizontal: Spacing,
    flex: 1,
  },
  
});

export default AppNumberInput;
