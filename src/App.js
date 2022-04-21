import React, {useEffect} from 'react';
import Providers from './Navigation';
import SplachScreen from 'react-native-splash-screen';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import firestore  from '@react-native-firebase/firestore';

// main app with notification handling
const App = () => {
  const requestPermission = async () => {
    const authState = await messaging().requestPermission();
  };
  const getFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        console.log('token=>>>', token);
        firestore().collection('tokens').add(token)
      });
  };

  async function localDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    notifee.displayNotification({
      title:
        '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
      subtitle: '&#129395;',
      body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
      android: {
        channelId,
        color: '#4caf50',
        actions: [
          {
            title: '<b>Dance</b> &#128111;',
            pressAction: {id: 'dance'},
          },
          {
            title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
            pressAction: {id: 'cry'},
          },
        ],
      },
    });
  }
  // general notification
  async function DisplayNotification(remoteMessage) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher_round', // optional, defaults to 'ic_launcher'.
      },
    });
  }

  useEffect(() => {
    requestPermission();
    SplachScreen.hide();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
      DisplayNotification(remoteMessage);
    })
    return unsubscribe;
  }, []);

  return <Providers />;
};

export default App;

