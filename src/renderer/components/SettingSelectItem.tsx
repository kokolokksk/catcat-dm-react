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
  const { theme, v, c, skey, options } = data;
  let dynamicOptions = options;
  if (skey === 'recentroomid') {
    if (!dynamicOptions) {
      dynamicOptions = [];
    } else {
      dynamicOptions = options.split(',').map((item: { roomid: number }) => {
        return {
          value: item,
          label: item,
        };
      });
    }
  }
  dynamicOptions = dynamicOptions.reduce((nVal: any[], item: any): any[] => {
    if (nVal.findIndex((nItem: any) => nItem.value === item.value) === -1) {
      nVal.push(item);
    }
    return nVal;
  }, []);
  if (skey === 'recentroomid') {
    const saveValue = dynamicOptions.map((item: any) => item.value).join(',');
    if (saveValue) {
      window.electron.store.set(
        'recentroomid',
        dynamicOptions.map((item: any) => item.value).join(',')
      );
    }
  }
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
          defaultValue={v}
          onChange={(text) => c(skey, text)}
          size="sm"
          width={100}
          colorScheme={theme === 'dark' ? 'orange' : 'teal'}
        >
          {dynamicOptions.map((option: { value: string; label: string }) => (
            <option style={{ cursor: 'pointer' }} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SettingSwitchItem;
