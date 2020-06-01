import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {useNavigation} from '@react-navigation/native';
import {View, TouchableHighlight, Image, Text, Vibration} from 'react-native';
import {PropTypes} from 'prop-types';
import * as RootNavigation from '../../RootNavigation';
import {tabSwitch} from '../../redux/actions/Tab';

import Colors from '../../constants/Colors';
import styles from './Styles';
import {ACTIVE_LIST} from '../../constants/TabName';
import {DEVICE_LIST_NAV} from '../../constants/Navigation';

const ListButton = props => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      disabled={ACTIVE_LIST === props.activeTab}
      style={{
        ...styles.touch,
        ...styles.active(ACTIVE_LIST === props.activeTab),
      }}
      underlayColor={Colors.active}
      onPress={() => {
        Vibration.vibrate(100);
        props.tabSwitch(ACTIVE_LIST);
        RootNavigation.navigate(DEVICE_LIST_NAV);
      }}>
      <View>
        <Image source={require('../../images/list.svg')} style={styles.image} />
        <Text style={styles.label}>List</Text>
      </View>
    </TouchableHighlight>
  );
};

ListButton.propTypes = {
  tabSwitch: PropTypes.func,
  activeTab: PropTypes.string,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      tabSwitch,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  activeTab: state.activeTab,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListButton);
