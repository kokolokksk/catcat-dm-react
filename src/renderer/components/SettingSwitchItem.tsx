import { FormControl, FormLabel, Switch, useColorMode } from '@chakra-ui/react';
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
        <Switch
          id="email-alerts"
          key={data.v}
          defaultChecked={data.v}
          onChange={(text) => data.c(data.skey, text)}
          size="md"
          colorScheme={colorMode === 'dark' ? 'orange' : 'teal'}
        />
      </FormControl>
    </div>
  );
};

export default SettingSwitchItem;
