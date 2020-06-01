import React from 'react';
import {PropTypes} from 'prop-types';

import {StyleSheet, View, Text} from 'react-native';

import Colors from '../../constants/Colors';

const HelpText = props => {
  return <Text style={styles.help}>{props.text}</Text>;
};

const DetailValue = props => {
  let color;
  if (props.active && !props.hasError && !props.isChanged) {
    color = Colors.active;
  } else if (props.active && props.isChanged) {
    color = Colors.statusOk;
  } else if (!props.active && props.isChanged) {
    color = Colors.green;
  } else if (props.active && props.hasError) {
    color = Colors.statusCritical;
  } else if (!props.active && props.hasError) {
    color = Colors.red;
  } else {
    color = Colors.transparent;
  }
  return (
    <View style={styles.container(color)}>
      <View style={styles.valueContainer}>
        <Text style={styles.label}>{props.label}</Text>
        <Text style={styles.value}>
          {props.value} {props.unit}
        </Text>
      </View>
      <HelpText text={props.help} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: color => ({
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'relative',
    backgroundColor: color,
  }),
  label: {
    fontSize: 20,
    width: '60%',
    height: 30,
  },
  help: {
    fontSize: 9,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  value: {
    width: '40%',
    fontSize: 20,
    height: 30,
    textAlign: 'right',
  },
});

DetailValue.defaultProps = {
  isDevice: false,
  active: false,
  isChanged: false,
  hasError: false,
};

DetailValue.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string,
  help: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number,
  active: PropTypes.bool,
};

export default DetailValue;
