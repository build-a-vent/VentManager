import React from 'react';
import {PropTypes} from 'prop-types';
import {TouchableHighlight, Vibration} from 'react-native';
import DetailValue from '../adjust/DetailValue';
import Colors from '../../constants/Colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {editVentilator} from '../../redux/actions/EditVentilator';
import {tabSwitch} from '../../redux/actions/Tab';
import {ADJUST_TAB} from '../../constants/TabName';
import {DEVICE_ADJUST_NAV} from '../../constants/Navigation';

const DetailTouchable = props => {
  return (
    <TouchableHighlight
      touchSoundDisabled={false}
      underlayColor={Colors.underlay}
      disabled={!props.editable}
      onLongPress={() => {
        props.editVentilator(props.mac);
        props.tabSwitch(ADJUST_TAB);
        Vibration.vibrate(200);
        props.navigation.navigate(DEVICE_ADJUST_NAV, {
          active: props.data,
          config: props.config,
        });
      }}>
      <DetailValue {...props} />
    </TouchableHighlight>
  );
};

DetailTouchable.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  mac: PropTypes.string.isRequired,
  help: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editVentilator,
      tabSwitch,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(DetailTouchable);
