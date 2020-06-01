import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Image, Text, TouchableHighlight} from 'react-native';
import Colors from '../../constants/Colors';
import {NETWORK_ERROR, MESSAGES} from '../../constants/Messages';
import {
  confirmWarnings,
  clearConfirmed,
} from '../../redux/actions/ConfirmWaring';
import {bindActionCreators} from 'redux';

class KeepAlive extends React.Component {
  messages = [];
  warningTime = 6000;
  criticalTime = 20000;
  constructor(props) {
    super(props);
  }

  getVent(mac) {
    return this.props.ventilators.find(data => data.mac === mac);
  }

  confirmMessage(mac, type, isWarning) {
    this.props.confirmWarnings({
      mac,
      type,
      isWarning,
    });
  }

  message(mac, type, isWarning) {
    const vent = this.getVent(mac);
    if (!vent) {
      return null;
    }

    return (
      <View key={`message-${mac}`} style={styles.errorWrapper(isWarning)}>
        <Image
          style={styles.imageWarning}
          source={
            isWarning
              ? require('../../images/warning.svg')
              : require('../../images/critical.svg')
          }
        />
        <Text style={styles.message}>{vent.name}</Text>
        <Text style={styles.type}>{MESSAGES[type]}</Text>
        <TouchableHighlight
          underlayColor={Colors.underlay}
          style={styles.confirm}
          onPress={() => this.confirmMessage(mac, type, isWarning)}>
          <Image
            style={styles.image}
            source={require('../../images/close.svg')}
          />
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const currentTime = Date.now();
    const critTime = currentTime - this.criticalTime;
    const warnTime = currentTime - this.warningTime;
    let key;
    let ventTime;
    const error = [];
    const warning = [];

    for (key in this.props.keepAlive) {
      if (this.props.ignoreAlarms.indexOf(key) !== -1) {
        continue;
      }

      ventTime = this.props.keepAlive[key];

      if (ventTime < critTime) {
        if (
          !this.props.confirmed[key] ||
          !this.props.confirmed[key].isWarning === false
        ) {
          error.push(this.message(key, NETWORK_ERROR, false));
        }
      } else if (ventTime < warnTime) {
        if (
          !this.props.confirmed[key] ||
          !this.props.confirmed[key].isWarning === true
        ) {
          warning.push(this.message(key, NETWORK_ERROR, true));
        }
      }
    }

    return (
      <View key="keep-alive-messages">
        {error.map((item, index) => item)}
        {warning.map((item, index) => item)}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  errorWrapper: isWarning => ({
    paddingLeft: 10,
    backgroundColor:
      isWarning === true ? Colors.statusFail : Colors.statusCritical,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  message: {
    paddingLeft: 5,
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 50,
    textAlignVertical: 'center',
  },
  type: {
    lineHeight: 50,
    textAlignVertical: 'center',
  },
  confirm: {
    width: 50,
    height: 50,
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginTop: 'auto',
    width: 30,
    height: 30,
  },
  imageWarning: {
    width: 40,
    height: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmWarnings,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  keepAlive: state.keepAlive,
  ventilators: state.ventilators,
  confirmed: state.confirmed,
  ignoreAlarms: state.ignoreAlarms,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeepAlive);
