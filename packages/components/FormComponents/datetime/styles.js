
import {StyleSheet} from  'react-native';
import DeviceInfo from 'react-native-device-info';
import colors from '../../../defaultTheme';
import Theme from '../../../defaultTheme';

const styles = StyleSheet.flatten({
  button: {
    // width: DeviceInfo.isTablet() ? 150 : 120,
    // marginHorizontal: DeviceInfo.isTablet() ? 10 : 0,
    backgroundColor: colors.primary1Color,
    marginHorizontal: 10,
    marginVertical: DeviceInfo.isTablet() ? 10 : 0,
  },
  date: {
    flex: 1,
    flexDirection: DeviceInfo.isTablet() ? 'row' : 'column'
  },
  dateText: {
    fontSize: DeviceInfo.isTablet() ? 18 : 12,
    marginLeft: 20,
    marginRight: 10,
    marginTop: 20,
  }
});

export default styles;
