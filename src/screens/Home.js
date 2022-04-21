import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import PostCard from '../../components/PostCard';
import {Container} from '../../styles/FeedStyles';
import {AuthContext} from '../Navigation/AuthProvider.android';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);// checking the loading process of posts
  const [deleted, setDeleted] = useState(false);

  //fetching posts from firebase
  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {userId, post, postImg, postTime,postType, userName} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: userName,
              userImg:
                'https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png',
              postTime: postTime,
              post,
              postType,
              postImg,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted,loading]);

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
    navigation.addListener('focus', () => setLoading(!loading));
  }, [deleted, navigation, loading]);

  //handling the deleting process
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

  // deleting the post and img from firebase
  const deletePost = (postId) => {
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
//deleting the img
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
// item handleEdit
  const handleEdit = (postId) => {
    navigation.navigate('EditPost', {postId});
  };
  
// handling the onPress 
  const handleChat = (userName, receiverId,chatRoom) => {
    console.log(userName, receiverId, chatRoom);
    
    navigation.navigate('Chat', {
      userName,
      receiverId,
      chatRoom,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 300, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 300, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      ) : (
        <Container>
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                onPress={() =>
                  user.uid === item.userId
                    ? navigation.navigate('Profile')
                    : navigation.navigate('HomeProfile', {userId: item.userId})
                }
                Edit={handleEdit}
                Chat={handleChat}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Container>
      )}
    </SafeAreaView>
  );
};

export default Home;
