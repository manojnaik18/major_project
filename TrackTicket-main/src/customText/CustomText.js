import React from 'react';

import { Text } from 'react-native-paper';

const CustomText = ({ style, ...props }) => {
  return <Text  style={[style]} {...props} />;
};

export default CustomText;
