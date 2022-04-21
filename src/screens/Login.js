import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import Forminput from '../../components/Forminput';
import FormButton from '../../components/FormButton';
import SocialButton from '../../components/SocialButton';
import {AuthContext} from '../Navigation/AuthProvider.android';
import { ScrollView } from 'react-native-gesture-handler';

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { login, googleLogin } = useContext(AuthContext);
// pattern to check the email
   const isValidEmail = (email) => {
    const regx = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
   return regx.test(email)
  }
  // handling the login process
  const handleLogin = (email, pswd) => {
    if (email == null && password == null) {
      return Alert.alert(
        'invalid login',
        'please check or insert credentials info',
        [
          {
            text: 'ok',
            //  onPress: () => console.log('canceled'),
            style: 'cancel',
          },
        ],
      );
    } else if (!isValidEmail(email)) {
      return Alert.alert(
        'invalid Email',
        'please check or insert a valid Email',
        [
          {
            text: 'ok',
            //  onPress: () => console.log('canceled'),
            style: 'cancel',
          },
        ],
      );
    } else if (pswd.length < 8 || pswd == null) {
         return Alert.alert(
           'invalid Password',
           'password cant be empty or less than 8 characters',
           [
             {
               text: 'ok',
               //  onPress: () => console.log('canceled'),
               style: 'cancel',
             },
           ],
         );
    }
      login(email,pswd)
  }

  return (
    <ScrollView style={{backgroundColor:'white'}}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/onLunch.png')}
          style={styles.logo}
        />
        <Text style={styles.text}> Helper App </Text>
        <Forminput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Forminput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle="Sign in"
          onPress={() => {handleLogin(email,password)}}
        />

        {Platform.OS === 'android' ? (
          <View>
            <SocialButton
              buttonTitle="Sign In with Google"
              btnType="google"
              color="#de4d41"
              backgroundColor="#f5e7ea"
              onPress={() => googleLogin()}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.forgotButton, {paddingTop: 30}]}
          onPress={() => navigation.navigate('ForgetPass')}>
          <Text style={styles.navButtonText}> Forget Password ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.navButtonText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    backgroundColor: 'white',
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'AbrilFatface-Regular',
    fontSize: 28,
    marginBottom: 10,
    color: '#0E76BC',
  },
  navButton: {
    marginTop: 35,
  },
  forgotButton: {
    marginVertical: 5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    // fontFamily: 'AbrilFatface-Regular',
  },
})
