import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {useTheme} from 'react-native-paper';

export const DropDown = ({setForm}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  let theme = useTheme();
  // Example bus stop data
  const busStops = [
    {
      label: 'Stop 1',
      value: 'stop1',
      latitude: '12.9716',
      longitude: '77.5946',
      fare: '10.00',
      placeName: 'Mangalore', // Place name added
    },
    {
      label: 'Stop 2',
      value: 'stop2',
      latitude: '13.0356',
      longitude: '77.5730',
      fare: '15.00',
      placeName: 'Pumpwell', // Place name added
    },
    {
      label: 'Stop 3',
      value: 'stop3',
      latitude: '13.0676',
      longitude: '77.7080',
      fare: '20.00',
      placeName: 'Padil', // Place name added
    },
    {
      label: 'Stop 3',
      value: 'stop3',
      latitude: '13.0676',
      longitude: '77.7080',
      fare: '20.00',
      placeName: 'BCRoad', // Place name added
    },
  ];

  const handleSelectItem = item => {
    setSelectedValue(item);
    setModalVisible(false);
    let fare = item?.fare;
    let data = JSON.stringify(item);
    setForm(prev => ({
      ...prev,
      destination: data,
      fare: fare,
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}>
        <CustomText
          style={{fontSize: 16, color: '#000', fontFamily: fonts.Regular}}>
          {selectedValue
            ? `Selected: ${selectedValue.label}`
            : 'Please choose a bus stop'}
        </CustomText>
      </TouchableOpacity>

      {/* Modal for dropdown list */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={busStops}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelectItem(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <CustomText
                      style={[
                        styles.itemCustomText,
                        {fontFamily: fonts.Regular},
                      ]}>
                      {item.label}
                    </CustomText>
                    <CustomText
                      style={[
                        styles.itemCustomText,
                        {fontFamily: fonts.Regular},
                      ]}>
                      ₹ {item.fare}
                    </CustomText>
                  </View>
                  <CustomText
                    style={[
                      styles.itemCustomText,
                      {fontFamily: fonts.Regular},
                    ]}>
                    {item?.placeName}
                  </CustomText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, {backgroundColor: theme.colors.btn}]}
              onPress={() => setModalVisible(false)}>
              <CustomText
                style={[styles.buttonCustomText, {fontFamily: fonts.SemiBold}]}>
                Close
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display selected bus stop details */}
      {selectedValue && (
        <View style={styles.selectedDetails}>
          <CustomText
            style={[styles.selectedCustomText, {fontFamily: fonts.Regular}]}>
            Fare: {selectedValue.fare}
          </CustomText>
          <CustomText
            style={[styles.selectedCustomText, {fontFamily: fonts.Regular}]}>
            Place: {selectedValue.placeName}
          </CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 20,
  },
  dropdownButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCustomText: {
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 8,
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemCustomText: {
    fontSize: 16,
    color: 'black',
  },
  itemSubCustomText: {
    fontSize: 12,
    color: 'gray',
  },
  closeButton: {
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  selectedDetails: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  selectedCustomText: {
    fontSize: 16,
  },
});
