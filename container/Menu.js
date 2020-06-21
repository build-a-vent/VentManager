import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {PropTypes} from 'prop-types';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  Text,
  Linking,
} from 'react-native';

import {
  DEVICE_LIST_NAV_HIDDEN,
  ABOUT_PAGE,
  CREDIT_PAGE,
} from '../constants/Navigation';
import Colors from '../constants/Colors';
import {tabSwitch} from '../redux/actions/Tab';
import * as RootNavigation from '../RootNavigation';
import {ADJUST_TAB, DETAIL_TAB} from '../constants/TabName';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  menu() {
    if (this.state.open === false) {
      return null;
    }
    return (
      <TouchableHighlight
        style={styles.backdrop}
        activeOpacity={1}
        underlayColor={Colors.transparent}
        onPress={() => this.setState({open: false})}>
        <View style={styles.menu} accessibilityRole="menu">
          <TouchableHighlight
            style={styles.menuTouch}
            underlayColor={Colors.active}
            onPress={() => {
              RootNavigation.navigate(DEVICE_LIST_NAV_HIDDEN);
              this.props.tabSwitch(DEVICE_LIST_NAV_HIDDEN);
              this.setState({open: false});
            }}>
            <Text style={styles.entry}>Hidden Ventilators</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.menuTouch}
            underlayColor={Colors.active}
            onPress={() => {
              RootNavigation.navigate(ABOUT_PAGE);
              this.props.tabSwitch(ABOUT_PAGE);
              this.setState({open: false});
            }}>
            <Text style={styles.entry}>About</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.menuTouch}
            underlayColor={Colors.active}
            onPress={() => {
              RootNavigation.navigate(CREDIT_PAGE);
              this.props.tabSwitch(CREDIT_PAGE);
              this.setState({open: false});
            }}>
            <Text style={styles.entry}>Credits</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.menuTouch}
            underlayColor={Colors.active}
            onPress={() => {
              let url = 'https://github.com/build-a-vent/VentManager/issues';
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                }
              });
            }}>
            <Text style={styles.entry}>Report a Bug</Text>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }

  icon() {
    if (this.state.open === true) {
      return null;
    }

    return (
      <TouchableHighlight
        style={styles.touch}
        underlayColor={Colors.transparent}
        onPress={() => {
          this.setState({open: true});
        }}>
        <Image style={styles.image} source={require('../images/burger.svg')} />
      </TouchableHighlight>
    );
  }

  render() {
    if (
      this.props.activeTab === ADJUST_TAB ||
      this.props.activeTab === DETAIL_TAB
    ) {
      return null;
    }
    return (
      <View key="burger-menu" style={styles.main(this.state.open)}>
        {this.menu()}
        {this.icon()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    zIndex: 1,
    fontWeight: 'bold',
    width: '100%',
  },

  menuTouch: {
    zIndex: 1,
    height: 30,
    width: '100%',
    marginBottom: 10,
  },

  backdrop: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: Colors.transparent,
  },

  main: open => {
    if (open === false) {
      return {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 99,
        height: 40,
        width: 40,
      };
    }

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 55,
    };
  },
  image: {
    width: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  touch: {
    width: 40,
    height: 40,
  },
  menu: {
    zIndex: 1,
    position: 'absolute',
    width: 200,
    height: 180,
    backgroundColor: Colors.white,
    right: 0,
    top: 0,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 15,
    paddingLeft: 10,
  },
});

Menu.propTypes = {
  tabSwitch: PropTypes.func,
  activeTab: PropTypes.string,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      tabSwitch,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  activeTab: state.activeTab,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
