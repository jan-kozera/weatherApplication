import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';
import MainScreen from './MainScreen';
import ReportScreen from './ReportScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'MainScreen'}
        component={MainScreen}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: 'transparent'
          }
        }}
      />
      <Stack.Screen
        name={'ReportScreen'}
        component={ReportScreen}
        options={{
          headerTitle: 'Back',
          headerTintColor: '#ffffff',
          headerStyle: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            elevation: 0,
            shadowOpacity: 0
          },
          cardStyle: {
            backgroundColor: 'transparent'
          }
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  navigatorStyles: {
    backgroundColor: 'transparent',
  }
});