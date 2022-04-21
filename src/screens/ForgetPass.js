import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {AuthContext} from '../Navigation/AuthProvider.android';
import Forminput from '../../components/Forminput';
import FormButton from '../../components/FormButton';

 // Forgetting password screen by sending an email 
const ForgetPass = () => {
  const [email, setEmail] = useState();
  const {forgetPass} = useContext(AuthContext);
  return (
    <View style={styles.body}>
      <Image style={styles.Img} source={require('../../assets/Forget.png')} />
      <Text style={styles.textTitle}>Forgot your Password ?</Text>
      <Text style={styles.textBody}>
        Don't worry we can help, {'\n'}
        Please provide your account email Below
      </Text>

      <Forminput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormButton
        buttonTitle="Send Reset Password Link"
        onPress={() => forgetPass(email)}
      />
    </View>
  );
};

export default ForgetPass;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  Img: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    borderRadius: 30,
  },
  textTitle: {
    paddingTop: 20,
    textAlign: 'center',
    fontFamily: 'Lato-BoldItalic',
    fontSize: 26,
    fontWeight: '500',
  },
  textBody: {
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: 18,
  },
});
