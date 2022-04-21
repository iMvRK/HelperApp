import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import OnLaunch from '../screens/OnLaunch';
import ForgetPass from '../screens/ForgetPass';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();
// the part of the application that handle the authentication
const AuthStack = () => {
  // state to tap the first lunch of the app
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  // a hook that grab the first lunch from 
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
    GoogleSignin.configure({
      webClientId: '509493357583-c2o3fna975gt7njcqnblanscoolam52h.apps.googleusercontent.com',
    });
  
  }, []);

    if (isFirstLaunch === null) {// the luach didnt happen yet 
      return null;
    } else if (isFirstLaunch == true) {// first launch its
      routeName = 'OnLaunch';
    } else {
      routeName = 'Login';//!first launch 
    }
  
  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Onboarding"
        component={OnLaunch}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ForgetPass"
        component={ForgetPass}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={({navigation}) => ({
          title: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={40}
                backgroundColor="white"
                color="#333"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
