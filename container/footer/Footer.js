import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {PropTypes} from 'prop-types';
import {View} from 'react-native';

import styles from './Styles';
import DetailButton from './Details';
import ListButton from './List';
import CancelButton from '../buttons/Cancel';
import SaveButton from '../buttons/Save';
import {tabSwitch} from '../../redux/actions/Tab';
import {DETAIL_TAB, ADJUST_TAB} from '../../constants/TabName';
import * as RootNavigation from '../../RootNavigation';
import {DEVICE_DETAIL_NAV} from '../../constants/Navigation';
import {saveVentilator} from '../../redux/actions/SaveVentilator';
const Footer = props => {
  if (props.activeTab !== ADJUST_TAB) {
    return (
      <View style={styles.container} key="footer">
        <ListButton />
        <DetailButton />
      </View>
    );
  }

  return (
    <View style={styles.container} key="footer">
      <SaveButton
        onPress={() => {
          props.saveVentilator();
          props.tabSwitch(DETAIL_TAB);
          RootNavigation.navigate(DEVICE_DETAIL_NAV);
        }}
      />
      <CancelButton
        onPress={() => {
          props.tabSwitch(DETAIL_TAB);
          RootNavigation.navigate(DEVICE_DETAIL_NAV);
        }}
      />
    </View>
  );
};

Footer.propTypes = {
  adjust: PropTypes.bool,
  active: PropTypes.bool,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      tabSwitch,
      saveVentilator,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  activeTab: state.activeTab,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
