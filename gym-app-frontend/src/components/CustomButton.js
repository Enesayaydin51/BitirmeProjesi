import { StyleSheet, Text, View , Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({buttonText , setWidth , handleOnPress , buttonColor , pressedButtonColor }) => {
  return (
        <Pressable 
         onPress={handleOnPress}
         style ={ ({pressed}) =>  [{
           backgroundColor: pressed ? pressedButtonColor : buttonColor,
           width:setWidth,
         },styles.buttonStyle]}>

           <Text style={styles.buttonText}> {buttonText}</Text>
         </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    buttonStyle:{
  height:40,
  borderRadius:10,
  alignItems:'center',
  justifyContent:'center',
  marginTop:20,
  shadowColor: '#FF8C00', // Hafif bir turuncu gölge ekleyerek 3D hissi verdim
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
 
},
buttonText:{
  fontWeight:'bold',
  color:'white'
},
})