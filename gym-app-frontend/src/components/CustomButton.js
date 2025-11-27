import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import React from 'react';

const CustomButton = ({
  buttonText,
  setWidth,
  handleOnPress,
  buttonColor,
  pressedButtonColor,
  textColor = "#000",        // 🟡 Varsayılan gold butonda siyah yazı
  borderColor = null,        // 🟡 Outline buton için
}) => {
  return (
    <Pressable
      onPress={handleOnPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? pressedButtonColor : buttonColor,
          width: setWidth,
          borderColor: borderColor,
          borderWidth: borderColor ? 1.2 : 0,
        },
        styles.buttonStyle,
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonStyle: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,

    // 🔥 Daha premium shadow
    shadowColor: '#D6B982',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.6,
  },
});
