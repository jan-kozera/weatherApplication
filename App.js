import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./assets/background.png')} resizeMode='cover' style={styles.imgBackground}>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height:height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackground: {
    width: '100%',
    height: '100%',
  },
});