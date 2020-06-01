import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';

const Saveing = props => {
  if (props.saveing === false) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Image style={styles.image} source={require('../images/save.svg')} />
      <Text style={styles.text}>Saving to vent ....</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(192, 192, 192, .8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 99999,
  },
  image: {
    marginTop: '45%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 80,
    height: 80,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

Saveing.propTypes = {
  saveing: PropTypes.bool,
};

const mapStateToProps = state => ({
  saveing: state.saveing,
});

export default connect(mapStateToProps)(Saveing);
