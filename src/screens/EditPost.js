import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  Picker,
  TouchableOpacity,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
  LoadImg,
  LoadedImg,
} from '../../styles/AddPost';
import Notify from '../Navigation/Notify';
import {AuthContext} from '../Navigation/AuthProvider.android';

// editing a post after sending it
export default EditPost = ({route, navigation}) => {
  //the first state is how we get the data by id
  const {postId} = route.params;
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [editedPost, setEditedPost] = useState(null);
  const [post, setPost] = useState(null);
  const [postType, setPostType] = useState('Help');

  let editPost = post;
  // the same function as in addpost
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // the same function as in addpost
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // the getting post function
  const getPost = async () => {
    await firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('Post to Edit', documentSnapshot.data());
          setEditedPost(documentSnapshot.data());
          if (documentSnapshot.data().postImg) {
            setImage(documentSnapshot.data().postImg);
          }

          setPost(documentSnapshot.data().post);
        }
      });
  };
  //inform all user about the updated post
  const sendMultiNotification = async () => {
    const tokens = [];
    await firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        console.log('Total Chats: ', querySnapshot.size);
        querySnapshot.forEach((doc) => {
          const {token} = doc.data();
          if (token != undefined) {
            tokens.push(token);
          }
        });
      });
    console.log(tokens);
    let notificationData = {
      title: `${postType} post have been Updated`,
      body: `${user.displayName} have updated a post`,
      token: tokens,
    };
    await Notify.sendMultiDeviceNotification(notificationData);
  };

  //function that handle updating the post
  const handleEdit = async () => {
    console.log('Current Post Id: ', postId);
    const imageUrl = await uploadImage();
    if ((post.length === 0)) {
      return Alert.alert(
        'invalid post',
        'please insert post info', [
        {
          text: 'ok',
          style: 'cancel',
        },
      ]);
    } else {
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          userId: user.uid,
          userName: user.displayName,
          post: post,
          postImg: imageUrl,
          postTime: firestore.Timestamp.fromDate(new Date()),
          postType: postType,
        })
        .then(() => {
          console.log('Post Updated!');
          sendMultiNotification();
          Alert.alert(
            'Post Updated!',
            'Your Post has been updated successfully.',
          );
          navigation.goBack();
        })
        .catch((error) => console.log(error));
    }
  };
  // uploading Image
  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // adding timeStamp to file Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos//${filename}`);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      //  image loading
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  // hook to get any change in data
  useEffect(() => {
    getPost();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Post type :</Text>
      <InputWrapper>
        <Picker
          selectedValue={postType}
          style={{height: 50, width: '100%'}}
          onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}>
          <Picker.Item label="Help Request" value="Help" />
          <Picker.Item label="Offer Help" value="Offer" />
        </Picker>
      </InputWrapper>
      <Text style={styles.text}> Description : </Text>
      <InputWrapper>
        <InputField
          placeholder=" Description "
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
      </InputWrapper>
      <Text style={styles.text}> image : </Text>

      {image != null ? (
        <LoadImg>
          <AddImage source={{uri: image}} />
          <ActionButton buttonColor="#2e64e550" spacing={10}>
            <ActionButton.Item
              buttonColor="red"
              title="Remove image"
              onPress={() => setImage(null)}>
              <Icon name="close-outline" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </LoadImg>
      ) : (
        <LoadedImg>
          <TouchableOpacity style={{flex: 1}}>
            <Icon name="md-images-outline" style={styles.actionButtonIcon} />
          </TouchableOpacity>
          <ActionButton buttonColor="#2e64e5" spacing={5}>
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="New Photo"
              onPress={takePhotoFromCamera}>
              <Icon name="camera-outline" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3498db"
              title="Choose Photo"
              onPress={choosePhotoFromLibrary}>
              <Icon name="md-images-outline" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </LoadedImg>
      )}

      {uploading ? (
        <StatusWrapper>
          <Text>{transferred} % Completed! </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </StatusWrapper>
      ) : (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <SubmitBtn onPress={handleEdit}>
            <SubmitBtnText>Re-Post</SubmitBtnText>
          </SubmitBtn>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    color: '#555555',
    marginBottom: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
