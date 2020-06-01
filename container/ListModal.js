import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {StyleSheet, View, Modal, Text, Switch} from 'react-native';
import {bindActionCreators} from 'redux';

import {toggleListModal} from '../redux/actions/ToogleListModal';
import SaveButton from './buttons/Save';
import CancelButton from './buttons/Cancel';
import Colors from '../constants/Colors';
import {enableAlarm, disableAlarm} from '../redux/actions/IgnoreAlarm';
import {removeIgnoreVent, ignoreVent} from '../redux/actions/IgnoreVentilator';

class ListModal extends React.Component {
  mac = null;

  handleIgnoreChange() {
    this.setState({
      ignore: !this.state.ignore,
      alarm: !this.state.ignore === true ? false : this.state.alarm,
    });
  }

  handleAlertChange() {
    this.setState({
      alarm: !this.state.alarm,
      ignore: !this.state.alarm === false ? this.state.ignore : false,
    });
  }

  saveSettings() {
    if (this.state.alarm === true) {
      this.props.enableAlarm(this.props.mac);
    } else {
      this.props.disableAlarm(this.props.mac);
    }

    if (this.state.ignore === true) {
      this.props.ignoreVent(this.props.mac);
    } else {
      this.props.removeIgnoreVent(this.props.mac);
    }

    this.props.toggleListModal();
    this.mac = null;
  }

  render() {
    if (!this.props.mac) {
      return null;
    }

    if (this.mac !== this.props.mac) {
      this.state = {
        alarm: this.props.ignoreAlarms.indexOf(this.props.mac) === -1,
        ignore: this.props.ignoreVentilator.indexOf(this.props.mac) !== -1,
      };
      this.mac = this.props.mac;
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.listModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{...styles.optionWrapper, ...{height: 50}}}>
              <View>
                <Text style={{...styles.label, ...{width: '40%'}}}>Name</Text>
              </View>
              <View
                style={{
                  ...styles.switchWrapper,
                  ...{width: '60%'},
                }}>
                <Text>{this.props.name}</Text>
              </View>
            </View>

            <View style={styles.optionWrapper}>
              <View>
                <Text style={styles.label}>Hide in List</Text>
              </View>
              <View style={styles.switchWrapper}>
                <Switch
                  value={this.state.ignore}
                  onChange={() => this.handleIgnoreChange()}
                />
              </View>
            </View>
            <View style={{...styles.optionWrapper, ...{marginTop: 20}}}>
              <View>
                <Text style={styles.label}>Alarms</Text>
              </View>
              <View style={styles.switchWrapper}>
                <Switch
                  value={this.state.alarm}
                  onChange={() => this.handleAlertChange()}
                />
              </View>
            </View>

            <View style={styles.buttomWrapper}>
              <SaveButton onPress={() => this.saveSettings()} />
              <CancelButton
                onPress={() => {
                  this.props.toggleListModal();
                  this.mac = null;
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.border,
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
  },
  buttomWrapper: {
    flex: 0,
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 18,
  },
  optionWrapper: {
    width: '90%',
  },
  switchWrapper: {position: 'absolute', right: 0, top: -3},
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeadline: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

ListModal.propTypes = {
  ventilatorModal: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  ignoreAlarms: PropTypes.array,
  ignoreVentilator: PropTypes.array,
  name: PropTypes.string,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleListModal,
      disableAlarm,
      enableAlarm,
      removeIgnoreVent,
      ignoreVent,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  mac: state.ventilatorModal,
  ignoreAlarms: state.ignoreAlarms,
  ignoreVentilator: state.ignoreVentilator,
  name: state.ventilatorModal
    ? state.ventilators.find(data => data.mac === state.ventilatorModal).name
    : '',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListModal);
