import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PropTypes } from 'prop-types';

import { selectVentilator } from '../redux/actions/ActiveVentilator';
import { tabSwitch } from '../redux/actions/Tab';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
  Vibration,
} from 'react-native';
import { toggleListModal } from '../redux/actions/ToogleListModal';

import Colors from '../constants/Colors';
import { DETAIL_TAB } from '../constants/TabName';
import { useNavigation } from '@react-navigation/native';
import { DEVICE_DETAIL_NAV } from '../constants/Navigation';

const inactiveAlarm = require('../images/inactiveAlarm.svg');
const activeAlarm = require('../images/activeAlarm.svg');

const Device = props => {
  const navigation = useNavigation();
  let image = activeAlarm;

  if (props.ignoreAlarms.indexOf(props.mac) !== -1) {
    image = inactiveAlarm;
  }
  return (
    <TouchableHighlight
      style={styles.isConfirmed(props.isConfirmed)}
      underlayColor={Colors.underlay}
      key={`touch-${props.mac}`}
      onLongPress={() => {
        Vibration.vibrate(200);
        props.toggleListModal(props.mac);
      }}
      onPress={() => {
        Vibration.vibrate(100);
        props.selectVentilator(props.mac);
        props.tabSwitch(DETAIL_TAB);
        navigation.navigate(DEVICE_DETAIL_NAV);
      }}>
      <View style={styles.sectionContainer}>
        <Image style={styles.bullet} source={image} />
        <Text style={styles.sectionTitle}>{props.c_name}</Text>
        <Text style={styles.sectionDescription}>{props.ip}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  bullet: {
    width: 20,
    height: 20,
    marginTop: 5,
  },
  isConfirmed: confirmed => ({
    backgroundColor: confirmed ? Colors.yellow : Colors.transparent,
  }),
  sectionContainer: {
    position: 'relative',
    marginTop: 32,
    paddingHorizontal: 24,
    borderBottomColor: Colors.dark,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    position: 'absolute',
    top: -7,
    left: 60,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.black,
    paddingLeft: 37,
  },
  highlight: {
    fontWeight: '700',
  },
});

Device.propTypes = {
  selectVentilator: PropTypes.func,
  tabSwitch: PropTypes.func,
  toggleListModal: PropTypes.func,
  ignoreAlarms: PropTypes.array,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectVentilator,
      tabSwitch,
      toggleListModal,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(Device);
