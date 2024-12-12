import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../component/Header';
import {useNavigation} from '@react-navigation/native';
import {TextInput, useTheme} from 'react-native-paper';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {showToast} from '../../utils/Toast';
import {useAuthContext} from '../context/GlobaContext';
import firestore from '@react-native-firebase/firestore';

export default function EditProfile() {
  const navigation = useNavigation();
  const theme = useTheme();
  const {userDetail,setCount} = useAuthContext();

  const [errors, setErrors] = useState({});
  const [submitSpinner, setSubmitSpinner] = useState(false);

  const [form, setForm] = useState(userDetail);

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    let newError = {};
    if (!form.name) {
      newError.name = 'Name is Required';
    }
    if (!form.email) {
      newError.email = 'Email is Required';
    }
    if (!form.password) {
      newError.fare = 'Password is Required';
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const SubmitForm = async () => {
    try {
      await setSubmitSpinner(true);
      if (!validateForm()) {
        showToast('Please correct the highlighted fields.');
        return; // Exit early if validation fails
      }
      // Update the Firestore document
      await firestore()
        .collection('conductor')
        .doc(userDetail?.id)
        .update(form);

      showToast('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating Firestore document:', error);
      showToast('Failed to submit the form. Please try again.');
    } finally {
      await setSubmitSpinner(false); // Ensure spinner is turned off in all cases
    }
  };

  return (
    <>
      <Header screenName={'Edit Detail'} />

      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View>
            <TextInput
              mode="outlined"
              label={'Name'}
              style={styles.input}
              value={form.name}
              onChangeText={value => handleChange('name', value)}
            />
            {errors.name && (
              <CustomText
                style={[
                  styles.errorText,
                  {fontFamily: fonts.Light, color: theme.colors.error},
                ]}>
                {errors.name}
              </CustomText>
            )}

            <TextInput
              mode="outlined"
              label={'Email'}
              style={styles.input}
              value={form.email}
              onChangeText={value => handleChange('email', value)}
            />
            {errors.email && (
              <CustomText
                style={[
                  styles.errorText,
                  {fontFamily: fonts.Light, color: theme.colors.error},
                ]}>
                {errors.email}
              </CustomText>
            )}

            <TextInput
              mode="outlined"
              label={'Password'}
              style={styles.input}
              value={form.password}
              secureTextEntry
              onChangeText={value => handleChange('password', value)}
            />

            {errors.password && (
              <CustomText
                style={[
                  styles.errorText,
                  {fontFamily: fonts.Light, color: theme.colors.error},
                ]}>
                {errors.password}
              </CustomText>
            )}

            {/* submit Btn */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={submitSpinner ? () => {} : SubmitForm}
              style={[
                styles.button,
                {backgroundColor: theme.colors.btn, marginBottom: 40},
              ]}>
              {submitSpinner ? (
                <ActivityIndicator size={25} color={theme.colors.appDark} />
              ) : (
                <CustomText
                  style={[
                    {
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: fonts.Bold,
                    },
                  ]}>
                  Submit
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 12,
  },

  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    marginVertical: 6,
  },

  errorText: {
    fontSize: 12,
  },
});
