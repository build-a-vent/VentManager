import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import Colors from '../../constants/Colors';
class Arrows extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <View
          style={{
            ...styles.touchWrapper(this.props.decreaseDisabled),
            ...styles.left,
          }}>
          <TouchableHighlight
            disabled={this.props.decreaseDisabled}
            activeOpacity={0.6}
            accessibilityRole="imagebutton"
            style={styles.touch}
            onPress={this.props.decrease}
            underlayColor={Colors.active}>
            <Image
              source={require('../../images/arrow_left.svg')}
              style={styles.image}
            />
          </TouchableHighlight>
        </View>

        <View
          style={{
            ...styles.touchWrapper(this.props.increaseDisabled),
            ...styles.right,
          }}>
          <TouchableHighlight
            activeOpacity={0.6}
            accessibilityRole="imagebutton"
            disabled={this.props.increaseDisabled}
            style={styles.touch}
            onPress={this.props.increase}
            underlayColor={Colors.active}>
            <Image
              source={require('../../images/arrow_right.svg')}
              style={styles.image}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const height = 80;
const styles = StyleSheet.create({
  wrapper: {
    height: height,
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  touchWrapper: disabled => ({
    width: 40,
    height: 40,

    opacity: disabled === true ? 0.3 : 1,
  }),
  touch: {
    height: '100%',
    width: '100%',
  },
  image: {
    width: 40,
    height: 40,
  },
  left: {
    top: height / 2 - 20,
    left: 30,
  },
  right: {
    position: 'absolute',
    top: height / 2 - 20,
    left: Dimensions.get('window').width - 70,
  },
});

Arrows.defaultProps = {
  increaseDisabled: true,
  decreaseDisabled: true,
  increase: () => {},
  decrease: () => {},
};

Arrows.propTypes = {
  increaseDisabled: PropTypes.bool,
  decreaseDisabled: PropTypes.bool,
};
const mapStateToProps = state => ({
  activeTab: state.activeTab,
});

export default connect(mapStateToProps)(Arrows);
