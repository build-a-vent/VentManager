import React from 'react';
import {PropTypes} from 'prop-types';
import {TouchableHighlight, Image, View, Text, Vibration} from 'react-native';

import Colors from '../../constants/Colors';
import buttonStyles from './ButtonSyles';

const SaveButton = props => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      style={buttonStyles.touch}
      underlayColor={Colors.active}
      onPress={() => {
        props.onPress();
        Vibration.vibrate(200);
      }}
      key="footer-save-button">
      <View style={buttonStyles.button}>
        <Image
          source={require('../../images/save.svg')}
          style={buttonStyles.image}
        />
        <Text style={{...buttonStyles.label, ...buttonStyles.save}}>Save</Text>
      </View>
    </TouchableHighlight>
  );
};

SaveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default SaveButton;
