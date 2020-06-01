import * as React from 'react';
import DeviceList from './DeviceList';

const DeviceListHidden = props => {
  return <DeviceList {...props} hidden={true} headline="Hidden vents" />;
};

export default DeviceListHidden;
