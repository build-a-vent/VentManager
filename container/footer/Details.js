import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, TouchableHighlight, Image, Text, Vibration} from 'react-native';
import {PropTypes} from 'prop-types';

import {tabSwitch} from '../../redux/actions/Tab';
import * as RootNavigation from '../../RootNavigation';

import Colors from '../../constants/Colors';
import styles from './Styles';
import {DETAIL_TAB, ADJUST_TAB} from '../../constants/TabName';
import {DEVICE_DETAIL_NAV, DEVICE_ADJUST_NAV} from '../../constants/Navigation';

const DetailButton = props => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      style={{
        ...styles.touch,
        ...styles.disablesTouch(props.activeVentilator === null),
        ...styles.active(props.activeTab === DETAIL_TAB),
      }}
      underlayColor={Colors.active}
      disabled={props.activeVentilator === null}
      onPress={() => {
        Vibration.vibrate(100);
        props.tabSwitch(DETAIL_TAB);
        RootNavigation.navigate(DEVICE_DETAIL_NAV);
      }}
      onLongPress={() => {
        Vibration.vibrate(200);
        props.tabSwitch(ADJUST_TAB);
        RootNavigation.navigate(DEVICE_ADJUST_NAV);
      }}
      key="footer-detail-button">
      <View>
        <Image source={require('../../images/lung.svg')} style={styles.image} />
        <Text style={styles.label}>Detail</Text>
      </View>
    </TouchableHighlight>
  );
};

DetailButton.propTypes = {
  activeVentilator: PropTypes.string,
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
  activeVentilator: state.activeVentilator,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailButton);
