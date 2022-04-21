import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// onboarding screen 
const Done = ({...props}) => (
  <TouchableOpacity
    style={{ marginHorizontal: 20 }}
    {...props}
  >
    <Text style={{fontSize:16,color:'#ffffff'}}>Let's Start</Text>
  </TouchableOpacity>
);

const onLaunch = ({navigation}) => {
  return (
    <Onboarding
      DoneButtonComponent={Done}
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#1AAEED',
          image: <Image source={require('../../assets/onLunch.png')} />,
          title: 'Welcome to Helper',
          subtitle: 'From the Community to Community',
        },
        {
          backgroundColor: '#387FE9',
          image: (
            <Image
              source={require('../../assets/hands.png')}
              style={{resizeMode: 'contain', width: 400, height: 350}}
            />
          ),
          title: 'From People To People',
          subtitle: 'Where people help each other \n Spreading Goodness',
        },
        {
          backgroundColor: '#1050A4',
          image: (
            <Image
              source={require('../../assets/treeSeed.png')}
              style={{
                width: 400,
                height: 350,
                resizeMode: 'contain',
              }}
            />
          ),
          title: 'A tree starts with a seed',
          subtitle: 'A small act of kindness can make a big difference',
        },
      ]}
    />
  );
};

export default onLaunch;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
