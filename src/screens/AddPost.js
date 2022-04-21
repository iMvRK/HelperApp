import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  Picker,
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
import {AuthContext} from '../Navigation/AuthProvider.android';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Notify from '../Navigation/Notify';

const AddPost = ({navigation}) => {
  // states to grab the inputs
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false); // chekcing for if the image is uploead to firebase
  const [transferred, setTransferred] = useState(0); // hook to show the loader
  const [post, setPost] = useState(null);
  const [postType, setPostType] = useState('Help');

  // function to takePhoto by camera
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

  //function choosePhotoFrom library
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
  // notify all users
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
      title: `${postType} post have been Added`,
      body: `${user.displayName} have added a new post`,
      token: tokens,
    };
    await Notify.sendMultiDeviceNotification(notificationData);
  };

  // upload the post
  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl); //checking the url
    console.log('Post : ', post); // post
    if (post.length === 0) {
      return Alert.alert(
        'invalid post',
        'please insert post info',
        [
          {
            text: 'ok',
            style: 'cancel',
          },
        ],
      );
    } else {
      firestore()
        .collection('posts')
        .add({
          userId: user.uid,
          userName: user.displayName,
          post: post,
          postImg: imageUrl,
          postTime: firestore.Timestamp.fromDate(new Date()),
          postType: postType,
        })
        .then(() => {
          console.log('Post added!'); // if the post is uploaded successfully
          sendMultiNotification(); // notify all users
          Alert.alert(
            // notifying the users about the outcome of the process
            'Post published ! ',
            'Your Post has been Uploaded successfully !',
          );
          setPost(null); // reseting the states
          navigation.navigate('Home'); // back to home screen
        })
        // handling th ewhole process in case of errors
        .catch((error) => {
          console.log(
            'Something went wrong with added post to firestore',
            error,
          );
        });
    }
  };
  //  function to handle uplaoding the image and edit its url
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
    setImage(null);
  };

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
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        </View>
      )}
    </ScrollView>
  );
};

export default AddPost;

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
