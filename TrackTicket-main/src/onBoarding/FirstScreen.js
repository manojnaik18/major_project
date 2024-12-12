import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {showToast} from '../../utils/Toast';
import {useAuthContext} from '../context/GlobaContext';

export default function FirstScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const {isLogin} = useAuthContext();

  const handleBtnPress = () => {
    if (isLogin) {
      showToast('Login First');
      navigation.navigate('Login');
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View
      style={[
        styles.maincontainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <ImageBackground
        style={styles.image}
        source={require('../../assets/Image/firstBanner.png')}
        resizeMode="contain"></ImageBackground>

      <View style={styles.welcomeView}>
        <CustomText style={[styles.welcomeText, {fontFamily: fonts.Bold}]}>
          Welcome to
        </CustomText>
        <CustomText
          style={[styles.welcomeText, {fontFamily: fonts.Bold, top: -6}]}>
          Track Ticket
        </CustomText>
        <CustomText style={[styles.subtitleText, {fontFamily: fonts.SemiBold}]}>
          Simplify your journey with seamless fare tracking
        </CustomText>
        <View style={[styles.featureContainer]}>
          <CustomText style={[styles.featureText, {fontFamily: fonts.Light}]}>
            Capture customer images effortlessly
          </CustomText>
          <CustomText style={[styles.featureText, {fontFamily: fonts.Light}]}>
            Track daily and total fares
          </CustomText>
          <CustomText style={[styles.featureText, {fontFamily: fonts.Light}]}>
            Manage trips with ease
          </CustomText>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleBtnPress}
        style={[styles.button, {backgroundColor: theme.colors.btn}]}>
        <CustomText
          style={[
            {
              color: '#fff',
              fontSize: 16,
              fontFamily: fonts.Bold,
            },
          ]}>
          Get started
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  image: {
    flexDirection: 'row',
    // flex: 1, // Ensures the image stretches to fill the parent container
    justifyContent: 'center', // Centers content inside ImageBackground (optional)
    alignItems: 'center', // Aligns items horizontally inside ImageBackground (optional)
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    borderRadius: 10, // Optional: Add rounded corners
    right: 10,
  },
  welcomeView: {},
  welcomeText: {
    fontSize: 30,
    textAlign: 'center',
  },
  featureContainer: {},
  subtitleText: {
    textAlign: 'center',
  },
  featureText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
