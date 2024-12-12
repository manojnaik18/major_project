import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {showToast} from '../../utils/Toast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useAuthContext} from '../context/GlobaContext';
import axios from 'axios';

export default function Home() {
  const {handleLogout, userDetail, ipAddress, count} = useAuthContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const isFocused = useIsFocused();
  const backPressedOnce = useRef(false);
  const [spinner, setSpinner] = useState(false);
  const [totalFare, setTotalFare] = useState(0);

  useEffect(() => {
    const GetFareSummary = async () => {
      try {
        const response = await axios.get(`${ipAddress}/total_fare`);
        if (response?.data?.status == 'true') {
          await setTotalFare(response?.data?.total_fare);
        } else {
          showToast('Something went wrong ...');
        }
      } catch (error) {
        console.error('Error fetching fare summary:', error.message);
        showToast('Something went wrong ...');
      }
    };
    if (ipAddress) {
      GetFareSummary();
    }
  }, [count]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFocused) {
          if (!backPressedOnce.current) {
            backPressedOnce.current = true;
            showToast("Tap again if you're ready to exit.");
            setTimeout(() => {
              backPressedOnce.current = false;
            }, 2000); // Reset backPressedOnce after 2 seconds
            return true;
          } else {
            BackHandler.exitApp();
            return true;
          }
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [isFocused]);

  const handleCamera = async () => {
    await setSpinner(true);
    const options = {
      mediaType: 'photo',
      quality: 1,
      base64: true,
    };
    
    await launchCamera(options, response => {
      if (response.didCancel) {
        showToast('Picture not selected ...');
      } else if (response.errorCode) {
        showToast('Something went wrong ...');
      } else {
        let imageUri = response.assets[0]?.uri;
        navigation.navigate('Form', {imageUri});
      }
    });
    await setSpinner(false);
  };

  const handleNavigate = () => {
    navigation.navigate('Edit Detail');
  };

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Header */}
        <View style={styles.headerView}>
          <View>
            <CustomText style={{fontFamily: fonts.Bold, fontSize: 24}}>
              Welcome Back ,
            </CustomText>
            <CustomText style={{fontFamily: fonts.Bold, fontSize: 24, top: -4}}>
              {userDetail?.name}
            </CustomText>
            <CustomText
              style={{fontFamily: fonts.Light, fontSize: 13, top: -4}}>
              {ipAddress}
            </CustomText>
          </View>
          <View style={{flexDirection: 'row', gap: 6, top: 10}}>
            <Iconify
              icon="fluent:text-bullet-list-square-edit-24-regular"
              size={30}
              color={theme.colors.onBackground}
              onPress={handleNavigate}
            />
            <Iconify
              icon="heroicons-outline:logout"
              size={30}
              color={theme.colors.onBackground}
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* Today's fare  */}
        <View
          style={[styles.fareView, {backgroundColor: theme.colors.appDark}]}>
          <View>
            <CustomText style={[styles.totalText, {fontFamily: fonts.Regular}]}>
              Total Fare
            </CustomText>
            <CustomText style={[styles.valueText, {fontFamily: fonts.Regular}]}>
              ₹ {totalFare}
            </CustomText>
          </View>

          <Iconify icon="pixelarticons:coin" size={35} color={'#fff'} />
        </View>

        <View style={styles.rulesContainer}>
          <CustomText style={[styles.rulesTitle, {fontFamily: fonts.Bold}]}>
            Guidelines :
          </CustomText>

          <View style={styles.rule}>
            <CustomText
              style={[styles.ruleNumber, {fontFamily: fonts.Regular}]}>
              1.
            </CustomText>
            <CustomText style={[styles.ruleText, {fontFamily: fonts.Regular}]}>
              Ensure accurate customer details are recorded, including the image
              and fare information.
            </CustomText>
          </View>

          <View style={styles.rule}>
            <CustomText
              style={[styles.ruleNumber, {fontFamily: fonts.Regular}]}>
              2.
            </CustomText>
            <CustomText style={[styles.ruleText, {fontFamily: fonts.Regular}]}>
              Maintain professionalism and assist customers politely throughout
              the journey.
            </CustomText>
          </View>

          <View style={styles.rule}>
            <CustomText
              style={[styles.ruleNumber, {fontFamily: fonts.Regular}]}>
              3.
            </CustomText>
            <CustomText style={[styles.ruleText, {fontFamily: fonts.Regular}]}>
              Verify daily fare collections and report discrepancies
              immediately.
            </CustomText>
          </View>

          <View style={styles.rule}>
            <CustomText
              style={[styles.ruleNumber, {fontFamily: fonts.Regular}]}>
              4.
            </CustomText>
            <CustomText style={[styles.ruleText, {fontFamily: fonts.Regular}]}>
              Keep the app updated and ensure proper syncing of data to avoid
              errors.
            </CustomText>
          </View>
        </View>

        {/* Capture image */}
        {spinner ? (
          <>
            <View style={styles.iconView}>
              <ActivityIndicator size={50} color={theme.colors.btn} />
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleCamera}
              activeOpacity={0.6}
              style={[styles.iconView]}>
              <Iconify
                icon="tabler:capture"
                size={80}
                color={theme.colors.btn}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fareView: {
    padding: 21,
    marginTop: 5,
    borderRadius: 15,
    marginHorizontal: 2,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    color: '#fff',
  },
  valueText: {
    fontSize: 28,
    color: '#fff',
  },
  rulesContainer: {
    padding: 15,
    backgroundColor: '#f9f9f1',
    borderRadius: 8,
    margin: 2,
    elevation: 2,
    marginVertical: 13,
  },
  rulesTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ruleNumber: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
  },
  ruleText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  iconView: {
    padding: 4,
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16,
  },
});
