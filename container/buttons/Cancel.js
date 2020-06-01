import React from 'react';
import {PropTypes} from 'prop-types';
import {TouchableHighlight, Image, View, Text, Vibration} from 'react-native';

import Colors from '../../constants/Colors';
import buttonStyles from './ButtonSyles';

const CancelButton = props => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      style={buttonStyles.touch}
      underlayColor={Colors.active}
      onPress={() => {
        props.onPress();
        Vibration.vibrate(100);
      }}
      key="footer-button-cancel">
      <View style={buttonStyles.button}>
        <Image
          source={require('../../images/cancel.svg')}
          style={buttonStyles.image}
        />
        <Text style={{...buttonStyles.label, ...buttonStyles.cancel}}>
          Cancel
        </Text>
      </View>
    </TouchableHighlight>
  );
};

CancelButton.propTypes = {
  onPress: PropTypes.func,
};

export default CancelButton;
