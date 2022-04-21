import React from 'react';
import {Image, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// main application screens
import Home from '../screens/Home';
import AddPost from '../screens/AddPost';
import Profile from '../screens/Profile';
import Messages from '../screens/Messages';
import Chat from '../screens/Chat';
import EditProfile from '../screens/EditProfile';
import EditPost from '../screens/EditPost';
import Notification from '../screens/Notification';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home page stack
const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerTitle: 'Helper App',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          color: '#ffffff',
          fontFamily: 'DancingScript-Regular',
          fontSize: 25,
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{margin: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="#2e64e5"
              color="#ffffff"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPost}
      options={{
        headerTitle: 'New Post',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#ffffff',
          fontFamily: 'DancingScript-Regular',
          fontSize: 25,
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#ffffff" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="EditPost"
      component={EditPost}
      options={{
        headerTitle: 'Edit Post',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#ffffff',
          fontFamily: 'DancingScript-Regular',
          fontSize: 25,
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#ffffff" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={Profile}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

// messaging stack 
const MessagesStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={Messages}
      options={{
        headerTitle: 'Message',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#ffffff',
          fontFamily: 'DancingScript-Regular',
          fontSize: 25,
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#000000',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

// profile stack 
const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        headerTitle: 'EditProfile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  // a function for removing the tab bar depend on the screen
  const getTabBarVisibility = (route) => {
    const routeName =
      getFocusedRouteNameFromRoute(route) ?? 'Chat' | 'AddPost' | 'EditProfile';

    if (
      routeName === 'Chat' ||
      routeName === 'AddPost' ||
      routeName === 'EditProfile'
    ) {
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#2e64e5',
      }}>
      <Tab.Screen
        name="Home"
        component={FeedStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
