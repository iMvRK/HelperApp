import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider.android';
import AuthStack from './AuthStack.android';
import AppStack from './AppStack';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const Routes = () => {
  //the state that check the user status
  const {user, setUser} = useContext(AuthContext);
  // the state that check the user in initializing
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = auth().currentUser.uid;

    // Add the token to the users datastore
    await firestore().collection('users').doc(userId).update({
      token: token,
    });
  };

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        console.log(token);
        return saveTokenToDatabase(token).catch((error) => console.log(error));
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    // a hook to keep checking the user status (login/logout)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  // if user loged in take him to main application else show him the authSatck
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
