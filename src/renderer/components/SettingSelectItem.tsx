import { Button, FormControl, FormLabel, Select } from '@chakra-ui/react';
import styles from '../styles/setting.module.scss';

const SettingSwitchItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  // const [switchColor, setSwitchColor] = useState('orange');
  // if (colorMode === 'dark') {
  //   setSwitchColor('teal');
  // }
  const { theme, v, c, skey, options, onDeleteCurrent, onClearAll } = data;
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
  console.info(v);
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
          mb="0"
          className={styles.rowLabel}
        >
          {data.name}
        </FormLabel>
        <div className={styles.selectWithActions}>
          <Select
            color={theme === 'dark' ? '#d9e8ff' : '#1f3557'}
            bg={theme === 'dark' ? '#1a2432' : '#f6fbff'}
            borderColor={theme === 'dark' ? '#314664' : '#c8daef'}
            style={{ cursor: 'pointer' }}
            value={v || ''}
            onChange={(text) => c(skey, text)}
            size="sm"
            width="220px"
          >
            {dynamicOptions.map((option: { value: string; label: string }) => (
              <option
                style={{ cursor: 'pointer' }}
                value={option.value}
                key={option.value}
              >
                {option.label}
              </option>
            ))}
          </Select>
          {skey === 'recentroomid' ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteCurrent?.(v)}
              >
                删除当前
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onClearAll?.()}
              >
                清空
              </Button>
            </>
          ) : null}
        </div>
      </FormControl>
    </div>
  );
};

export default SettingSwitchItem;
