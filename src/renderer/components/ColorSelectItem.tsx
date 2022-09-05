/* eslint-disable react/destructuring-assignment */
import { Button } from '@chakra-ui/react';
import Colorful from '@uiw/react-color-colorful';
import { useState } from 'react';
import styles from '../styles/color.module.scss';

const ColorSelectItem = (prop: any | undefined) => {
  const [hex, setHex] = useState('#fff');
  return (
    <>
      <div id={prop.colorItemContainerId} className={styles.colorItemContainer}>
        <p />
        {prop.label}
        <div id={prop.colorItemPreviwerId} className={styles.colorItemPreviwer}>
          <div>
            <Colorful
              color={hex}
              onChange={(color) => {
                setHex(color.hex);
              }}
            />
          </div>
        </div>
        <Button
          className={styles.leftMargin && styles.colorItemBtn}
          onClick={prop.c}
        >
          设置
        </Button>
      </div>
    </>
  );
};

export default ColorSelectItem;
