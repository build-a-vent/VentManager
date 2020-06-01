import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

import Colors from '../constants/Colors';
import Libraries from '../constants/Libraries';
import * as Licenses from '../constants/Licenses';
import {baseStyles} from './styles/styles';

const dynamicSort = property => {
  var sortOrder = 1;

  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function(a, b) {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

const url = {
  raj: 'https://freeicons.io/profile/714',
  becris: 'https://freeicons.io/profile/3484',
};

class Credis extends React.Component {
  libs = Libraries.sort(dynamicSort('lib'));

  constructor(props) {
    super(props);

    this.state = {open: null};
  }

  licenseInfo(data) {
    if (
      this.state.open === null ||
      data.lib !== this.state.open ||
      !Licenses[data.license]
    ) {
      return null;
    }

    return <Text>{Licenses[data.license](data.copy)}</Text>;
  }

  openLink(target) {
    Linking.canOpenURL(url[target]).then(supported => {
      if (supported) {
        Linking.openURL(url[target]);
      }
    });
  }

  libInfo(data) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.state.open === data.lib
              ? this.setState({open: null})
              : this.setState({open: data.lib});
          }}
          style={styles.linkWrapper}>
          <View>
            <Text style={styles.libName}>{data.lib}</Text>
          </View>
        </TouchableOpacity>
        {this.licenseInfo(data)}
      </View>
    );
  }

  render() {
    return (
      <View>
        <Text style={styles.pageHeadline}>Credits</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.wrapper}>
          <Text style={styles.headline}>Icons</Text>
          <TouchableOpacity
            onPress={() => this.openLink('raj')}
            style={styles.linkWrapper}>
            <Text>
              Icon made by <Text style={styles.link}>Raj Dev</Text> from
              www.freeicons.io
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.openLink('becris')}
            style={styles.linkWrapper}>
            <Text>
              Icon made by <Text style={styles.link}>BERCRIS</Text> from
              www.freeicons.io
            </Text>
          </TouchableOpacity>
          <Text style={styles.headline}>Libraries we use</Text>
          <Text>
            The following sets forth attribution notices for third-party
            software that may be contained in portions of the Vent Android
            application. We thank the open-source community for all of their
            contributions.
          </Text>
          {this.libs.map(data => this.libInfo(data))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  libName: {
    color: Colors.linkColor,
    fontWeight: 'bold',
  },
  link: {
    color: Colors.linkColor,
    borderBottomColor: Colors.linkColor,
    borderBottomWidth: 1,
  },
  wrapper: {
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 100,
  },
  pageHeadline: baseStyles.headline,
});

export default Credis;
