import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import Arrows from './Arrows';
import Colors from '../../constants/Colors';
import DetailValue from './DetailValue';
import * as VentConfig from '../../constants/VentilatorData';
import {updateVentilator} from '../../redux/actions/UpdateVentilator';
import {bindActionCreators} from 'redux';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Adjust from './Adjust';
import {VENT_LIMITS} from '../../constants/Limits';
import ConfigMenu from '../menu/Config';
import {baseStyles} from '../styles/styles';
import EditMenu from '../../constants/EditMenu';
import {editText} from '../../constants/EditIfoTexts';

const {height} = Dimensions.get('window');

const operator = {
  '-': (base, step) => base - step,
  '+': (base, step) => base + step,
};

const limiter = (value, limits) => {
  if (value <= limits[0]) {
    return -1;
  }
  if (value >= limits[1]) {
    return 1;
  }

  return 0;
};

class AdjustDevice extends React.Component {
  decreaseDisabled = false;
  increaseDisabled = false;
  errors = null;
  changed = null;
  constructor(props) {
    super(props);
    this.calculate = new Adjust();
    this.state = {
      config: this.props.route.params.config,
    };

    this.errors = [];
    this.changed = [];

    const active = this.props.route.params
      ? this.props.route.params.active
      : VentConfig.config.find(data => data.editable === true).data;

    this.state = {
      active,
      ...this.state,
      ...this.getActiveParams(active),
    };
  }

  /**
   *
   * @param {string} active
   */
  getActiveParams(active) {
    const current = VentConfig[this.state.config].find(
      data => data.data === active,
    );

    return {
      step: current.step,
    };
  }

  /**
   *
   * @param {array} value
   */
  setErrors(value) {
    let index;
    value.forEach(val => {
      if (this.errors.indexOf(val) === -1) {
        this.errors.push(val);
      }
      index = this.changed.indexOf(val);
      if (index !== -1) {
        this.changed.splice(index, 1);
      }
    });
  }

  /**
   *
   * @param {array} value
   */
  setChanged(value) {
    let index;
    value.forEach(val => {
      if (this.changed.indexOf(val) === -1) {
        this.changed.push(val);
      }
      index = this.errors.indexOf(val);
      if (index !== -1) {
        this.errors.splice(index, 1);
      }
    });
  }

  checkArrowsDisabledState() {
    const currentValue = this.calculate.getValue(this.state.active);
    const limit = limiter(currentValue, VENT_LIMITS[this.state.active]);

    if (this.getEditText() !== null) {
      this.decreaseDisabled = true;
      this.increaseDisabled = true;
      return;
    }
    this.decreaseDisabled = limit === -1;
    this.increaseDisabled = limit === 1;
  }

  /**
   *
   * @param {string} op
   */
  handleValueChange(op) {
    let value = this.calculate.getValue(this.state.active);
    const toValidate = operator[op](value, this.state.step);

    const result = this.calculate.validate(this.state.active, toValidate);

    if (result.error) {
      this.setErrors(result.error);
    } else {
      this.setChanged(result.valid);
      this.props.updateVentilator(this.active);
    }
  }

  setActive(active) {
    this.setState({
      active,
      ...this.getActiveParams(active),
    });
  }

  getCurrentIcon() {
    const current = EditMenu.find(data => data.action === this.state.config);
    return current.image;
  }

  getEditText() {
    if (!editText[this.state.config]) {
      return null;
    }

    return <Text style={styles.editText}>{editText[this.state.config]}</Text>;
  }

  render() {
    this.active = this.calculate.setActive(this.props.ventilator);
    this.checkArrowsDisabledState();

    return (
      <View>
        <ConfigMenu onPress={action => this.setState({config: action})} />
        <View style={styles.iconHeadline}>
          <Image source={this.getCurrentIcon()} style={styles.headlineIcon} />
          <Text style={styles.headline}>{this.props.ventilator.name}</Text>
        </View>
        <View>
          {this.getEditText()}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.sectionContainer(this.getEditText())}>
            {VentConfig[this.state.config].map(props => (
              <TouchableHighlight
                touchSoundDisabled={false}
                underlayColor={Colors.underlay}
                disabled={!props.editable}
                onPress={() => this.setActive(props.data)}
                key={`edit-${props.key}-${this.props.ventilator.mac}`}>
                <DetailValue
                  {...props}
                  hasError={this.errors.indexOf(props.data) !== -1}
                  isChanged={this.changed.indexOf(props.data) !== -1}
                  value={this.calculate.getValue(props)}
                  active={
                    this.state.active ? this.state.active === props.data : false
                  }
                />
              </TouchableHighlight>
            ))}
          </ScrollView>
        </View>
        <Arrows
          decreaseDisabled={this.decreaseDisabled}
          increaseDisabled={this.increaseDisabled}
          increase={() => this.handleValueChange('+')}
          decrease={() => this.handleValueChange('-')}
        />
      </View>
    );
  }
}

AdjustDevice.propTypes = {
  ventilator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  ...baseStyles,
  sectionContainer: hasText => {
    let adjust = 0;
    if (hasText !== null) {
      adjust = 50;
    }
    return {
      marginTop: 5,
      height: height - 210 - adjust,
    };
  },
  editText: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 20,
    fontSize: 16,
    color: 'orange',
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateVentilator,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  ventilator: state.editVentilator,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdjustDevice);
