import { FormControl, FormLabel, Select, useColorMode } from '@chakra-ui/react';
import styles from '../styles/setting.module.scss';

const SettingSwitchItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  // const [switchColor, setSwitchColor] = useState('orange');
  // if (colorMode === 'dark') {
  //   setSwitchColor('teal');
  // }
  const { theme, v, c, skey } = data;
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
          color="orange"
          style={{ cursor: 'pointer' }}
          id="email-alerts"
          key={v}
          defaultValue={v}
          onChange={(text) => c(skey, text)}
          size="sm"
          width={100}
          colorScheme={theme === 'dark' ? 'orange' : 'teal'}
        >
          <option style={{ cursor: 'pointer' }} value="light">
            白色
          </option>
          <option style={{ cursor: 'pointer' }} value="dark">
            黑色
          </option>
          <option style={{ cursor: 'pointer' }} value="wave">
            波浪
          </option>
          <option style={{ cursor: 'pointer' }} value="longluuu">
            长颈鹿
          </option>
        </Select>
      </FormControl>
    </div>
  );
};

export default SettingSwitchItem;
