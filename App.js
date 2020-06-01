/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//import 'react-native-gesture-handler';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import DeviceList from './container/DeviceList';
import DeviceListHidden from './container/DeviceListHidden';
import About from './container/About';
import ValueDetail from './container/details/DetailView';
import AdjustDevice from './container/adjust/AdjustDevice';
import store from './redux/Store';
import Colors from './constants/Colors';
import {
  DEVICE_LIST_NAV,
  DEVICE_DETAIL_NAV,
  DEVICE_ADJUST_NAV,
  ABOUT_PAGE,
  DEVICE_LIST_NAV_HIDDEN,
  CREDIT_PAGE,
} from './constants/Navigation';

import {navigationRef} from './RootNavigation';
import Footer from './container/footer/Footer';
import Menu from './container/Menu';
import {CardStyleInterpolators} from '@react-navigation/stack';
import Saveing from './container/Saving';
import MessageCenter from './container/messages/MessageCenter';
import Credis from './container/Credits';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.body}>
          <MessageCenter />
          <Menu />
          <Stack.Navigator initialRouteName={DEVICE_LIST_NAV} headerMode="none">
            <Stack.Screen
              name={DEVICE_LIST_NAV}
              component={DeviceList}
              options={{
                cardStyleInterpolator:
                  CardStyleInterpolators.forRevealFromBottomAndroid,
              }}
            />
            <Stack.Screen
              name={DEVICE_DETAIL_NAV}
              component={ValueDetail}
              options={{
                cardStyleInterpolator:
                  CardStyleInterpolators.forRevealFromBottomAndroid,
              }}
            />
            <Stack.Screen name={DEVICE_ADJUST_NAV} component={AdjustDevice} />
            <Stack.Screen name={ABOUT_PAGE} component={About} />
            <Stack.Screen name={CREDIT_PAGE} component={Credis} />
            <Stack.Screen
              name={DEVICE_LIST_NAV_HIDDEN}
              component={DeviceListHidden}
            />
          </Stack.Navigator>

          <Footer />
          <Saveing />
        </View>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
  },
});

export default App;
