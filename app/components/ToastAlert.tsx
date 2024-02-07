import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import fonts from '../../config/fonts';
import FontSize from '../../constants/FontSize';
import Font from '../../constants/Font';

interface CustomToastProps {
  message: string;
  visible: boolean;
}

const ToastAlert: React.FC<CustomToastProps> = ({ message, visible }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 5000); // Duration to display the toast
      });
    }
  }, [visible, opacity, message]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.error,
    zIndex: 10,
    padding: Spacing,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  message: {
    color: '#ffff',
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
  },
});

export default ToastAlert;
