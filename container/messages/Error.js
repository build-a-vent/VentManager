import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {StyleSheet, View, Image, Text} from 'react-native';

const Network = props => {
  return (
    <>
      <Image source={require('../../images/wifi.svg')} />
      <Text style={styles.message}>{props.message}</Text>
    </>
  );
};

const ErrorsMessages = props => {
  const message = [];
  let key;

  for (key in props.errors) {
    switch (key) {
      case 'network':
        message.push(<Network message={props.errors[key]} />);
    }
  }

  return (
    <>
      {message.map(item => (
        <View style={styles.errorWrapper}>{item}</View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  errorWrapper: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
  },
  message: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(ErrorsMessages);
