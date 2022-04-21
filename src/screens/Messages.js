import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, FlatList} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserImgWrapper,
  UserName,
  UserInfoText,
  TextSection,
  PostTime,
  MessageText,
} from '../../styles/MessageStyles';
import moment from 'moment';
import {AuthContext} from '../Navigation/AuthProvider.android';
import firestore from '@react-native-firebase/firestore';
// component to render the chatlist
const Messages = ({navigation}) => {
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);
  const list = [];

  const getUser = async (id) => {
    const doc = await firestore().collection('users').doc(id).get();

    const receiver = {
      id: doc.id,
      userName: doc.data().userName,
      userImg: doc.data().userImg,
    };
    return receiver;
  };
// fetching the user chats 
  const fetchChat = async () => {
    try {
      await firestore()
        .collection(`Chats`)
        .where('users', 'array-contains', user.uid)
        .onSnapshot((doc = {}))
        .get()
        .then((querySnapshot) => {
          console.log('Total Chats: ', querySnapshot.size); //to check posts in firestore

          querySnapshot.forEach((doc) => {
            const {id, users, lastMessage, sendAt} = doc.data();
            let senderId = null;
            users.forEach((person) => {
              if (person != user.uid) {
                senderId = person;
              }
            });
            getUser(senderId).then((receiver) => {
              list.push({
                id,
                lastMessage,
                sendAt,
                senderId,
                senderName: receiver.userName,
                senderImg: receiver.userImg,
              });
              setMessageData(list);
            });
          });
        });
      setMessageData(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Chats: ', JSON.stringify(messageData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChat = (userName, receiverId, chatRoom) => {
    navigation.navigate('Chat', {
      userName,
      receiverId,
      chatRoom,
    });
  };
  //  hooks and lisnters
  useEffect(() => {
    fetchChat();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  useEffect(() => {
    const list = messageData;
    const unsubscribe = firestore()
      .collection(`Chats`)
      .where('users', 'array-contains', user.uid)
      .onSnapshot((docs) => {
        if (docs) {
          docs.forEach((doc) => {
            const {id, users, lastMessage, sendAt} = doc.data();
            let senderId = null;
            users.forEach((person) => {
              if (person != user.uid) {
                senderId = person;
              }
            });
            getUser(senderId).then((receiver) => {
              if (messageData.find((room) => room.id === id)) {
                let index = messageData.findIndex((msg) => msg.id == id);
                console.log(index);
                messageData[
                  messageData.findIndex((msg) => msg.id == id)
                ].lastMessage = lastMessage;
                messageData[
                  messageData.findIndex((msg) => msg.id == id)
                ].sendAt = sendAt;
              } else {
                list.push({
                  id,
                  lastMessage,
                  sendAt,
                  senderId,
                  senderName: receiver.userName,
                  senderImg: receiver.userImg,
                });
              }
            });
          });
        }
      });
    return unsubscribe, setMessageData(list);
  }, []);

  return (
    <Container>
      {loading ?? fetchChat()}
      <FlatList
        data={messageData}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() => {
              handleChat(item.senderName, item.senderId, item.id);
            }}>
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={{
                    uri: item.senderImg,
                  }}
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.senderName}</UserName>
                  <PostTime>{moment(item.sendAt.toDate()).fromNow()}</PostTime>
                </UserInfoText>
                <MessageText>{item.lastMessage}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default Messages;
