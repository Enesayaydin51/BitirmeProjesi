import { StyleSheet, Text, View , TextInput} from 'react-native'
import React from 'react'

const CustomTextInput = ({title, isSecureText ,handleonChangeText ,  handleValue , handlePlaceholder }) => {
  return (
     <View style={styles.InputContainer}>
         <Text style={styles.InputBoxText}> {title} </Text>
         <TextInput
          
          secureTextEntry={isSecureText}
          placeholder={handlePlaceholder}
          onChangeText={handleonChangeText}
          value={handleValue}
          style={styles.TextInputStyle}
         />
    </View>
  )
}

export default CustomTextInput

const styles = StyleSheet.create({
InputContainer:{
  width:'90%',

},
InputBoxText:{
  color:'white',
  fontWeight:'bold',
  alignSelf:'flex-start',

},
  TextInputStyle: {
    color:'white',
    borderBottomWidth:0.5,
    borderColor:'#ffffffff',
    width:'100%',
    height:40,
    marginVertical:10,
    textAlign:'center',
    borderRadius:10 , 
   
    
},
})