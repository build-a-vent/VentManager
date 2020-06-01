import {StyleSheet} from 'react-native';

import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  touch: {
    width: '50%',
    height: 50,
  },
  save: {
    backgroundColor: Colors.save,
    width: '50%',
  },
  cancel: {
    backgroundColor: Colors.cancel,
    width: '50%',
  },
  active: active => ({
    backgroundColor: active === true ? Colors.active : Colors.lighter,
  }),

  image: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  disablesTouch(state) {
    if (state === true) {
      return {
        opacity: 0.5,
      };
    }
  },
  label: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 9,
  },
});

export default styles;
