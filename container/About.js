import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Supporters from '../constants/Supporters';
import Colors from '../constants/Colors';

const handleLink = () => {
  const url = 'http://www.build-a-vent.org';

  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};

const About = props => {
  return (
    <View style={styles.main}>
      <Image
        style={styles.image}
        source={require('../images/build-a-vent-logo.svg')}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.headline}>Project idea</Text>
        <Text>
          We attempt to relief the problems resulting from the shortness in
          supply by designing a ventilator device following criteria that will
          support fast and broad availability.
        </Text>
        <Text style={styles.headline}>
          Simple to build but professional in performance
        </Text>
        <Text>
          While our approach is simple and fast to embrace, we do take great
          care to make sure we fulfill the medical requirements for helping
          Covid-19 patients by verifying our design with renowned medical
          experts (like Prof. Dr. Rossaint, University Clinic Aachen, and the
          University Clinic Eppendorf in Hamburg).
        </Text>
        <TouchableOpacity onPress={handleLink} style={styles.linkWrapper}>
          <Text>Website: </Text>
          <Text style={styles.link}>http://www.build-a-vent.org</Text>
        </TouchableOpacity>
        <Text style={styles.headline}>Supporters</Text>
        <Grid>
          <Row style={styles.header}>
            <Col>
              <Text>Who</Text>
            </Col>
            <Col>
              <Text>for</Text>
            </Col>
          </Row>

          {Supporters.map(data => (
            <Row>
              <Col>
                <Text>{data.name}</Text>
              </Col>
              <Col>
                <Text>{data.job}</Text>
              </Col>
            </Row>
          ))}
        </Grid>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
    marginBottom: 90,
  },
  linkWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  link: {
    color: Colors.linkColor,
    borderBottomColor: Colors.linkColor,
    borderBottomWidth: 1,
  },
  image: {
    width: 250,
    height: 50,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
});

export default About;
