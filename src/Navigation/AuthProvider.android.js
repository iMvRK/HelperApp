import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

// a the parent component
export const AuthContext = createContext();
// the children component
export const AuthProvider = ({children}) => {
  // a state to set and get the user
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      // Children values
      value={{
        user, // the user
        setUser, // set the user
        // the login function using
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            return Alert.alert(
              'Login failed',
              'please check your credentials info',
              [
                {
                  text: 'ok',
                  style: 'cancel',
                },
              ],
            );
          }
        },
        // the function to handle the google account login
        googleLogin: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                console.log(
                  'current User',
                  auth().currentUser,
                  auth().currentUser.displayName,
                );
                // updating the user data in firebase
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    userId: auth().currentUser.uid,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    userName: auth().currentUser.displayName,
                    phone: null,
                    token: messaging().getToken(),
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch((error) => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              // we need to catch the whole sign up process if it fails too.
              .catch((error) => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.warn(error);
          }
        },

        register: async (userFname, userLname, email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the details.
                auth()
                  .currentUser.updateProfile({
                    displayName: userFname + ' ' + userLname,
                    photoURL:
                      'https://firebasestorage.googleapis.com/v0/b/test-dfbea.appspot.com/o/photos%2Fdownload.png?alt=media&token=ee1dd6b2-c503-44d1-9a70-fac64a8eb12a',
                  })
                  .then(() => {
                    firestore()
                      .collection('users')
                      .doc(auth().currentUser.uid)
                      .set({
                        userName: auth().currentUser.displayName,
                        userId: auth().currentUser.uid,
                        fname: userFname,
                        lname: userLname,
                        email: email,
                        createdAt: firestore.Timestamp.fromDate(new Date()),
                        userImg:
                          'https://firebasestorage.googleapis.com/v0/b/test-dfbea.appspot.com/o/photos%2Fdownload.png?alt=media&token=ee1dd6b2-c503-44d1-9a70-fac64a8eb12a',
                        phone: null,
                      })
                      //ensure we catch any errors at this stage to advise us if something does go wrong
                      .catch((error) => {
                        Alert.alert('Something went wrong ', 'check your info');
                      });
                  })
                  .then(() => {});
              })
              //we need to catch the whole sign up process if it fails too.
              .catch((error) => {
                Alert.alert('Something went wrong ', 'check your info');
                console.log(error);
              });
          } catch (error) {
            console.log('register error' + '\n' + error);
          }
        },
        //the forget password function that send a rest password via email
        forgetPass: async (email) => {
          console.log('reset email sent to ' + email);
          await auth()
            .sendPasswordResetEmail(email)
            .then(() => {
              alert('reset email sent to ' + email);
            })
            .catch((error) => {
              console.log(error);
            });
        },
        // logout function
        logout: async () => {
          try {
            await auth().signOut();
            setUser(null);
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
