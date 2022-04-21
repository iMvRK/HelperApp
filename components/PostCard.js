import React, {useContext, useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../src/Navigation/AuthProvider';
import moment from 'moment';
import ProgressiveImage from './ProgressiveImage';
import firestore from '@react-native-firebase/firestore';
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostType,
  PostImg,
  Interaction,
  InteractionText,
  InteractionWrapper,
  DividerLine,
} from '../styles/FeedStyles';
import {TouchableOpacity, Linking, Alert} from 'react-native';

// component that render the posts data
const PostCard = ({ item, onDelete, onPress, navigation, Edit, Chat }) => {
  //state for the current user
  const { user } = useContext(AuthContext);
  //getting and setting userData the user data
  const [userData, setUserData] = useState(null);
  //getting and setting the user data in that state from the data 
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
//  hook in case of nay changes
  useEffect(() => {
    getUser();
  }, []);
// returning the the screen elements
  return (
    <Card>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png'
              : 'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png',
          }}
        />
        <UserInfoText>
          <TouchableOpacity onPress={onPress}>
            <UserName>{userData ? userData.userName : 'user'}</UserName>
          </TouchableOpacity>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostType> {item.postType + ' post'}</PostType>
      <PostText> {item.post}</PostText>
      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 250}}
          resizeMode="cover"
        />
      ) : (
        <DividerLine />
      )}

      {user.uid == item.userId ? (
        <InteractionWrapper>
          <Interaction onPress={() => Edit(item.id)}>
            <Ionicons name="create-outline" size={25} />
          </Interaction>
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={25} />
          </Interaction>
        </InteractionWrapper>
      ) : (
        <InteractionWrapper>
          <Interaction
            onPress={() => {
              let phoneNumber = userData.phone;
              if (phoneNumber === null) {
                return Alert.alert(
                  'Cant make the call',
                  `${item.userName} phone number isn't available`,
                  [
                    {
                      text: 'ok',
                      style: 'cancel',
                    },
                  ],
                );
              } else {
                Linking.openURL(`tel:${phoneNumber}`);
              }
            }}>
            <Ionicons name={'call-outline'} size={25} color={'#333'} />
            <InteractionText> Call </InteractionText>
          </Interaction>
          <Interaction
            onPress={() => {
              let sender = user.uid;
              let receiver = item.userId;
              let chatRoom = [sender, receiver].sort().join('');
              if (
                (sender == user.uid && receiver == item.userId) ||
                (sender == item.userId && receiver == user.uid)
              ) {
                chatRoom;
              }

              Chat(item.userName, item.userId, chatRoom);
            }}>
            <Ionicons name="chatbubbles-outline" size={25} />
            <InteractionText>Message</InteractionText>
          </Interaction>
          <Interaction
              onPress={() => {
                Linking.openURL(
                  `mailto:f.alhemedi1@gmail.com?subject= report about user: ${item.userName} - ${item.userId.substring(0, 6)}****&body=Description of the report`
                )
            }}>
            <Ionicons name="information-circle-outline" size={25} />
            <InteractionText>Report</InteractionText>
          </Interaction>
        </InteractionWrapper>
      )}
    </Card>
  );
};
export default PostCard;
