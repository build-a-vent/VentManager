import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {StyleSheet, View, ScrollView, Text} from 'react-native';

import Device from './Device';
import ListModal from './ListModal';
import {baseStyles} from './styles/styles';
const Headline = props => {
  if (!props.text) {
    return null;
  }

  return <Text style={styles.headline}>{props.text}</Text>;
};

const DeviceList = props => {
  let index = 0;
  return (
    <View key="device-list" style={styles.wrapper}>
      <Headline text={props.headline} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {props.ventilators.map(data => {
          index = props.ignoreVentilator.indexOf(data.mac);
          if (props.hidden === true && index === -1) {
            return null;
          } else if (props.hidden === false && index !== -1) {
            return null;
          }

          return (
            <Device
              {...data}
              key={`device-${data.mac}`}
              hidden={props.hidden}
              ignoreAlarms={props.ignoreAlarms}
            />
          );
        })}
        <ListModal />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create(baseStyles);

DeviceList.defaultProps = {
  hidden: false,
  headline: 'Active vents',
};

DeviceList.propTypes = {
  ventilators: PropTypes.array,
  hidden: PropTypes.bool.isRequired,
  headline: PropTypes.string,
  mac: PropTypes.string,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  ventilators: state.ventilators,
  ignoreAlarms: state.ignoreAlarms,
  ignoreVentilator: state.ignoreVentilator,
});

export default connect(mapStateToProps)(DeviceList);
