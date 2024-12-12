import {Alert, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {showToast} from '../../utils/Toast.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Authcontext = createContext();
export const AuthContextProvider = ({children}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [count, setCount] = useState(0);
  const [ipAddress, setIpAddress] = useState(null);

  const GetUserDetail = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      if (!userToken) {
        console.warn('No user token found');
        return; // Exit if no token is found
      }
      await firestore()
        .collection('conductor')
        .doc(userToken)
        .onSnapshot(snapShot => {
          if (snapShot.exists) {
            const getData = {...snapShot.data(), id: snapShot.id};
            setUserDetail(getData); // Set user details if the account is active
          } else {
            console.warn('User document does not exist');
          }
        });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const GetEndPoint = async () => {
    try {
      await firestore()
        .collection('EndPoint')
        .doc('portNum')
        .onSnapshot(async snapShot => {
          if (snapShot.exists) {
            let data = snapShot.data();
            console.log(data?.ipAddress,'data?.ipAddress');
            await setIpAddress(data?.ipAddress);
          } else {
            console.warn('User document does not exist');
          }
        });
    } catch (error) {
      console.log('error when getting endPoint : ', error);
    }
  };

  useEffect(() => {
    GetUserDetail();
    GetEndPoint();
  }, []);

  const Checknetinfo = async () => {
    const state = await NetInfo.fetch(); // Get the current network state
    if (!state.isConnected) {
      showToast('No internet connection.', 'error');
      return false; // No internet connection
    }
    return true; // Internet connection is available
  };

  const gotoSetting = () => {
    Alert.alert(
      'Notification Permission Denied',
      'Please grant permission for notifications in the app settings to continue.',
      [
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout', //title
      'Are you sure ,you want to logout ?', //message
      [
        {
          text: 'Cancel', // Cancel button
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', // OK button
          onPress: () => {
            setIsLogin(true);
            AsyncStorage.setItem('IsLogin', 'false');
            AsyncStorage.clear();
            setUserDetail(null);
            showToast('Logout successfully!');
            // some logic
          },
        },
      ],
      {cancelable: false}, // Optionally prevent dismissing by tapping outside the alert
    );
  };

  return (
    <Authcontext.Provider
      value={{
        isLogin,
        setIsLogin,
        Checknetinfo,

        // User Detail
        userDetail,
        setUserDetail,

        // logout func
        handleLogout,

        gotoSetting,
        setCount,
        count,

        ipAddress,
      }}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuthContext = () => useContext(Authcontext);
