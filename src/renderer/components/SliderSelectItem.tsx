import {
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import styles from '../styles/setting.module.scss';

const SliderSelectItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  const [sliderValue, setSliderValue] = React.useState(5);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const { theme, v, c, skey } = data;
  console.info(v);
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
        <Slider
          id="slider"
          defaultValue={5}
          min={0}
          max={100}
          width={250}
          colorScheme="teal"
          onChange={(vv) => {
            setSliderValue(vv);
            c(skey, vv / 100);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderMark value={25} mt="1" ml="-2.5" fontSize="8">
            25%
          </SliderMark>
          <SliderMark value={50} mt="1" ml="-2.5" fontSize="8">
            50%
          </SliderMark>
          <SliderMark value={75} mt="1" ml="-2.5" fontSize="8">
            75%
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg="teal.500"
            color="white"
            placement="top"
            isOpen={showTooltip}
            label={`${sliderValue}%`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </FormControl>
    </div>
  );
};

export default SliderSelectItem;
