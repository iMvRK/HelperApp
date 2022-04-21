import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, FlatList} from 'react-native';

const Notification = () => {
  const {data,setData}=useState([])
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.notificationList}
          enableEmptySections={true}
          data={data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <View style={styles.notificationBox}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/onLunch.png')}
                />

                <Text style={styles.description}>{item.description}</Text>
              </View>
            );
          }}
        />
      </View>
    );
}
export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  notificationBox: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderRadius: 10,
  },
  icon: {
    width: 45,
    height: 45,
  },
  description: {
    fontSize: 18,
    color: '#3498db',
    marginLeft: 10,
  },
});
