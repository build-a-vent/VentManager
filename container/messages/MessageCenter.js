import React from 'react';
import {StyleSheet, View} from 'react-native';

import ErrorsMessages from './Error';
import KeepAlive from './KeepAlive';
import Colors from '../../constants/Colors';
const MessageCenter = () => {
  return (
    <View style={styles.wrapper}>
      <ErrorsMessages key="error-messges" />
      <KeepAlive key="keep-alive-wrapper" />
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
});

export default MessageCenter;
