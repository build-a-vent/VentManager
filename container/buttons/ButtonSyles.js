import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const buttonStyles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  touch: {
    width: '50%',
    height: '100%',
  },
  label: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 9,
  },
  save: {
    color: Colors.save,
  },
  cancel: {
    color: 'red',
  },
  button: {
    backgroundColor: Colors.active,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 5,
  },
});

export default buttonStyles;
