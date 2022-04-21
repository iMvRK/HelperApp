import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Forminput from '../../components/Forminput';
import FormButton from '../../components/FormButton';
import {AuthContext} from '../Navigation/AuthProvider.android';

//signup component
const Signup = ({navigation}) => {
  const [userFname, setUserFname] = useState();
  const [userLname, setUserLname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const {register} = useContext(AuthContext);

  const isValidEmail = (email) => {
    const regx =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regx.test(email);
  };
//  handling and validating  the sign up process
  const handleRegister = (userFname, userLname, email, pswd, confirmPswd) => {
    if ((userFname, userLname, email, pswd, confirmPswd === null)) {
      return Alert.alert('invalid signup ', 'credentials info cant be empty ', [
        {
          text: 'ok',
          style: 'cancel',
        },
      ]);
    } else if (userFname, userLname === null) {
      return Alert.alert(
        'Name cant be empty',
        'please check or insert your first and last name',
        [
          {
            text: 'ok',
            style: 'cancel',
          },
        ],
      );
    } else if (userFname.length < 2 || userLname.length < 2) {
      return Alert.alert(
        'invalid first name or last name',
        'please check or insert your first and last name',
        [
          {
            text: 'ok',
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
            style: 'cancel',
          },
        ],
      );
    } else if (pswd != confirmPswd) {
      return Alert.alert(
        'Passwords are not the Same',
        'Please enter the same password',
        [
          {
            text: 'ok',
            style: 'cancel',
          },
        ],
      );
    }
    register(userFname, userLname, email, pswd);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.Img} source={require('../../assets/form.png')} />
        <Text style={styles.text}> Create an Account </Text>
        <Forminput
          labelValue={userFname}
          onChangeText={(userFname) => setUserFname(userFname)}
          placeholderText="First Name"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Forminput
          labelValue={userLname}
          onChangeText={(userLname) => setUserLname(userLname)}
          placeholderText="Last Name"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Forminput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="mail"
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
        <Forminput
          labelValue={confirmPassword}
          onChangeText={(userPassword) => setConfirmPassword(userPassword)}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            By registering, you confirm that you accept our{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked')}>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              Terms of service{' '}
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> and </Text>
          <TouchableOpacity>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        <FormButton
          buttonTitle="Sign Up"
          onPress={() => {
            {
              handleRegister(
                userFname,
                userLname,
                email,
                password,
                confirmPassword,
              );
            }
          }}
        />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navButtonText}> Have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'Lato-Regular',
    fontSize: 28,
    marginBottom: 10,
    color: '#0E76BC',
  },
  Img: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    borderRadius: 30,
  },
  navButton: {
    marginTop: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
