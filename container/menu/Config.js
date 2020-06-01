import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {PropTypes} from 'prop-types';
import Colors from '../../constants/Colors';
import EditMenu from '../../constants/EditMenu';
import {baseStyles} from '../styles/styles';

class ConfigMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  getMenu() {
    if (this.state.open === false) {
      return null;
    }

    return (
      <View style={styles.menu}>
        {EditMenu.map(data => (
          <TouchableHighlight
            key={`menu-${data.action}`}
            style={styles.menuTouch}
            onPress={() => {
              this.setState({open: false});
              this.props.onPress(data.action);
            }}
            underlayColor={Colors.underlay}>
            <>
              <Image source={data.image} style={styles.icon} />
              <Text style={styles.menuText}>{data.name}</Text>
            </>
          </TouchableHighlight>
        ))}
      </View>
    );
  }

  render() {
    return (
      <View key="config-menu">
        <TouchableHighlight
          style={styles.settingsTouch}
          touchSoundDisabled={false}
          underlayColor={Colors.underlay}
          onPress={() => this.setState({open: !this.state.open})}>
          <Image
            source={require('../../images/cog.svg')}
            style={styles.settingsImage}
          />
        </TouchableHighlight>
        {this.getMenu()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingsTouch: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  menuTouch: {
    zIndex: 1,
    marginBottom: 5,
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  settingsImage: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  menu: baseStyles.menu(),
  menuText: baseStyles.menuText,
});

ConfigMenu.propTypes = {
  onPress: PropTypes.func,
};

export default ConfigMenu;
