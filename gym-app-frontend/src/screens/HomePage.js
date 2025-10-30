import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from '../components/Layout'

const HomePage = () => {
  return (
  <Layout>
    <View style={styles.container}>
      <Text>HomePage</Text>
     
    </View>
     </Layout>
  )
}

export default HomePage

const styles = StyleSheet.create({
container:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
}



})