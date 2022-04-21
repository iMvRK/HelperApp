import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../Navigation/AuthProvider.android';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import PostCard from '../../components/PostCard';
import {DividerLine} from '../../styles/FeedStyles';

// the user profile component
const Profile = ({navigation, route, Chat}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);

  // getting the user info 
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
//  fetching his posts
  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ',querySnapshot.size);  to check posts in firestore

          querySnapshot.forEach((doc) => {
            const {userId, post, postImg, postTime, postType, userName} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: userName,
              userImg:
                'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png',
              postTime: postTime,
              post,
              postImg,
              postType,
            });
          });
        });

      setPosts(list);
      if (loading) {
        setLoading(false);
      }
      console.log('posts: ', posts);
    } catch (error) {
      console.log(error);
    }
  };

  function checkHelp(post) {
    return post.postType === 'Help';
  }
  function checkOffer(post) {
    return post.postType === 'Offer';
  }

  // handle posts updates
  const handleEdit = (postId) => {
    Alert.alert(
      'Edit post',
      'Are you Sure ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel is Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => navigation.navigate('EditPost', {postId}),
        },
      ],
      {cancelable: false},
    );
  };
//  hook to refresh the page
  useEffect(() => {
    getUser();
    setDeleted(false)
    fetchPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [deleted,navigation, loading]);

  const handleDelete = (postId) => {
    Alert.alert(
      'Delete post',
      'Are you Sure ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel is Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };
  const deletePost = (postId) => {
    // console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been Deleted successfully.`);
                deleteFirestoreData(postId);
                setDeleted(true);
              })
              .catch((e) => {
                console.log('Error while deleting the image.', e);
              });
          } else {
            deleteFirestoreData(postId);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteFirestoreData = (postId) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post Deleted !',
          'Your Post has been Deleted Successfully',
        );
      })
      .catch((e) => console.log('Error deleting Post', e));
  };
  const handleChat = (userName, receiverId, chatRoom) => {
    console.log(userName, receiverId, chatRoom);

    navigation.navigate('Chat', {
      userName,
      receiverId,
      chatRoom,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg ||
                'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png'
              : 'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png',
          }}
        />
        <Text style={styles.userName}>
          {userData ? userData.userName || 'user' : 'user'}
        </Text>
        <Text style={styles.aboutUser}>
          {userData ? userData.about || ' ' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  let sender = user.uid;
                  let receiver = userData.userId;
                  let chatRoom = [sender, receiver].sort().join('');
                  if (
                    (sender == user.uid && receiver == userData.userId) ||
                    (sender == userData.userId && receiver == user.uid)
                  ) {
                    chatRoom;
                  }
                  handleChat(userData.userName, userData.userId, chatRoom);
                }}>
                <Text style={styles.userBtnTxt}> Message </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => { Linking.openURL(
                `mailto:f.alhemedi1@gmail.com?subject= report about user: ${
                  route.params.userName
                } - ${route.params.userId.substring(
                  0,
                  6,
                )}****&body=Description of the report`,
              )}}>
                <Text style={styles.userBtnTxt}> Report </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.userBtnTxt}> Edit </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}> Logout </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}> Posts </Text>
          </View>

          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>
              {posts.filter(checkHelp).length}
            </Text>
            <Text style={styles.userInfoSubTitle}> help offered </Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>
              {posts.filter(checkOffer).length}
            </Text>
            <Text style={styles.userInfoSubTitle}> help requests </Text>
          </View>
        </View>
        <DividerLine style={{marginBottom: 10}} />

        {posts.map((item) => (
          <PostCard
            key={item.id}
            item={item}
            onDelete={handleDelete}
            Edit={handleEdit}
            Chat={handleChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
