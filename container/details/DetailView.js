import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Vibration,
  ScrollView,
  Image,
} from 'react-native';

import Colors from '../../constants/Colors';
import {DEVICE_ADJUST_NAV} from '../../constants/Navigation';
import {bindActionCreators} from 'redux';
import {editVentilator} from '../../redux/actions/EditVentilator';
import Arrows from '../adjust/Arrows';
import {tabSwitch} from '../../redux/actions/Tab';
import {ADJUST_TAB} from '../../constants/TabName';
import DetailTouchable from './DetailTouch';
import Calculation from './Calculation';
import {baseStyles} from '../styles/styles';
import * as VentConfig from '../../constants/VentilatorData';
import EditMenu from '../../constants/EditMenu';
import ConfigMenu from '../menu/Config';

const {height} = Dimensions.get('window');

class ValueDetail extends React.Component {
  active = null;
  constructor(props) {
    super(props);
    this.calculate = new Calculation();

    this.state = {
      config: 'config',
    };
  }

  setEdit(key, callback) {
    this.setState({
      edit: true,
      editField: key,
      editCallback: callback,
    });
  }

  getCurrentIcon() {
    const current = EditMenu.find(data => data.action === this.state.config);
    return current.image;
  }

  render() {
    this.active = this.calculate.setActive(
      this.props.ventilators.find(
        data => data.mac === this.props.activeVentilator,
      ),
    );

    const globalLong = VentConfig[this.state.config].find(
      data => data.editable === true,
    );

    return (
      <View style={styles.wrapper}>
        <ConfigMenu onPress={action => this.setState({config: action})} />
        <View style={styles.iconHeadline}>
          <Image source={this.getCurrentIcon()} style={styles.headlineIcon} />
          <Text style={styles.headline}>{this.active.name}</Text>
        </View>
        <TouchableOpacity
          disabled={!globalLong}
          touchSoundDisabled={false}
          underlayColor={Colors.underlay}
          onLongPress={() => {
            this.props.editVentilator(this.active.mac);
            this.props.tabSwitch(ADJUST_TAB);
            Vibration.vibrate(200);
            this.props.navigation.navigate(DEVICE_ADJUST_NAV, {
              config: this.state.config,
              active: globalLong.data,
            });
          }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.sectionContainer}>
            <View style={styles.content}>
              {VentConfig[this.state.config].map(props => {
                return (
                  <DetailTouchable
                    {...props}
                    key={`list-${props.key}-${this.active.mac}`}
                    value={this.calculate.getValue(props)}
                    navigation={this.props.navigation}
                    mac={this.active.mac}
                    config={this.state.config}
                  />
                );
              })}
            </View>
          </ScrollView>
          <Arrows />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ...baseStyles,
  wrapper: {
    height: height - 75,
  },
  sectionContainer: {
    borderBottomColor: Colors.dark,
    minHeight: height - 200,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
});

ValueDetail.propTypes = {
  name: PropTypes.string,
  ip: PropTypes.string,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editVentilator,
      tabSwitch,
    },
    dispatch,
  );

const mapStateToProps = state => {
  return {
    activeVentilator: state.activeVentilator,
    ventilators: state.ventilators,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValueDetail);
