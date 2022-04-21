import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useLayoutEffect,
} from 'react';
import {Send, Bubble, GiftedChat} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../Navigation/AuthProvider.android';
import firestore from '@react-native-firebase/firestore';
import Notify from '../Navigation/Notify'

const Chat = ({route}) => {
  const {receiverId} = route.params; // getting th reciever id to use it for getting hisinfo
  const {chatRoom} = route.params; // the chat room id
  const chatId = firestore().collection('Chats').doc(`${chatRoom}`);
  // sender , receiver , and messages data
  const {user} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState();
  const [receiverData, setReceiverData] = useState();

  // getting the current user info
  const getUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
  // getting the reciver info
  const getReceiver = async () => {
    const receiverUser = await firestore()
      .collection('users')
      .doc(receiverId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('receiver Data', documentSnapshot.data());
          setReceiverData(documentSnapshot.data());
          receiverToken = documentSnapshot.data().token;
        }
      });
  };

  // hook for sender and receiver data
  useEffect(() => {
    getUser();
    getReceiver();
  }, []);
  // description for the chat room
  const chatRoomInfo = (createdAt, text) =>
    chatId.set({
      id: chatRoom,
      lastMessage: text,
      sendAt: createdAt,
      users: [receiverId, user.uid],
    });
  // a listner foe the chatroom
  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection(`Chats/${chatRoom}/Chat`)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        ),
      );
    return unsubscribe;
  }, []);
  // sending notification to both ends
  const sendNotification = async () => {
    let notificationData = {
      title: 'New Message',
      body: `${user.displayName} have sent you a message`,
      token: receiverData ? receiverData.token : null,
    };
    Notify.sendSingleDeviceNotification(notificationData);
  };
  // on sending the message this function is called to append the Prior's messages to the new onsand show them
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];

    firestore().collection(`Chats/${chatRoom}/Chat`).add({
      _id,
      createdAt,
      text,
      user,
    });
    sendNotification(); //notifying
    chatRoomInfo(createdAt, text); //updating the doc description
  }, []);

  // customizing send button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{margin: 5}}
            size={40}
            color={'#2e64e5'}
          />
        </View>
      </Send>
    );
  };
  // customizing messages bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };
// adding a buttom to scroll down 
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#2e64e550" />;
  };
//rendring the components
  return (
    <GiftedChat
      messages={messages}
      onPress={Keyboard.dismiss()}
      accessible={false}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user.uid,
        name:
          (userData ? userData.fname || 'user' : 'user') +
          ' ' +
          (userData ? userData.lname || 'user' : ' '),
        avatar: userData
          ? userData.userImg ||
            'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png'
          : 'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png',
        user: user.displayName,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default Chat;

const styles = StyleSheet.create({});
