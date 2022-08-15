import { FormControl, FormLabel, Select, Switch, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import styles from '../styles/setting.module.scss';

const SettingSwitchItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  const { colorMode, toggleColorMode } = useColorMode();
  // const [switchColor, setSwitchColor] = useState('orange');
  // if (colorMode === 'dark') {
  //   setSwitchColor('teal');
  // }
  console.info(data.v);
  return (
    <div className={styles.setting_input_item}>
      <p className={styles.line} />
      <FormControl display="flex" alignItems="center">
        <FormLabel
          htmlFor="email-alerts"
          mb="0"
          fontSize={20}
          fontFamily="consolas"
        >
          {data.name}
        </FormLabel>
        <Select
          style={{ cursor: 'pointer' }}
          id="email-alerts"
          key={data.v}
          defaultValue={data.v}
          onChange={(text) => data.c(data.skey, text)}
          size="sm"
          width={100}
          colorScheme={colorMode === 'dark' ? 'orange' : 'teal'}
        >
          <option style={{ cursor: 'pointer' }} value="light">白色</option>
          <option style={{ cursor: 'pointer' }} value="dark">黑色</option>
          <option style={{ cursor: 'pointer' }} value="wave">波浪</option>
          <option style={{ cursor: 'pointer' }} value="longluuu">长颈鹿</option>
        </Select>
      </FormControl>
    </div>
  );
};

export default SettingSwitchItem;
