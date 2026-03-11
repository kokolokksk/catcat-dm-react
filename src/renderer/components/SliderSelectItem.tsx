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
  const {
    theme,
    v,
    c,
    skey,
    min = 0,
    max = 100,
    step = 1,
    marks,
    formatLabel,
    normalizeValue,
  } = data;
  const initialValue = Number(v ?? min);
  const [sliderValue, setSliderValue] = React.useState(initialValue);
  const [defaultValue, setDefaultValue] = React.useState(initialValue);
  const [showTooltip, setShowTooltip] = React.useState(false);
  useEffect(() => {
    const nextValue = Number(data.v ?? min);
    setSliderValue(nextValue);
    setDefaultValue(nextValue);
    console.info(`vvvv:${data.v}`);
  }, [data.v, min]);
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
        {defaultValue >= 0 && (
          <Slider
            id="slider"
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            width={260}
            colorScheme={theme === 'dark' ? 'blue' : 'cyan'}
            onChange={(vv) => {
              setSliderValue(vv);
              c(skey, normalizeValue ? normalizeValue(vv) : vv);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {(marks || []).map((mark: any) => (
              <SliderMark
                key={`${skey}-${mark.value}`}
                value={mark.value}
                mt="1"
                ml="-2.5"
                fontSize="8"
              >
                {mark.label}
              </SliderMark>
            ))}
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={formatLabel ? formatLabel(sliderValue) : String(sliderValue)}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        )}
      </FormControl>
    </div>
  );
};

export default SliderSelectItem;
