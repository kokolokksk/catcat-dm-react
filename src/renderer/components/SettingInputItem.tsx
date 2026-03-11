/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  useEditableControls,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styles from '../styles/setting.module.scss';

const SettingInputItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  const [draftValue, setDraftValue] = useState(String(data.v || '-'));
  const [maskedEditing, setMaskedEditing] = useState(false);

  useEffect(() => {
    setDraftValue(String(data.v || '-'));
    setMaskedEditing(false);
  }, [data.v]);

  const maskValue = (value: string) => {
    if (!value || value === '-') {
      return '-';
    }
    if (value.length <= 8) {
      return `${value.slice(0, 1)}${'*'.repeat(
        Math.max(value.length - 2, 1)
      )}${value.slice(-1)}`;
    }
    return `${value.slice(0, 4)}${'*'.repeat(6)}${value.slice(-4)}`;
  };
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm" alignItems="top">
        <Button color="green.500" {...getSubmitButtonProps()}>
          {' '}
          √{' '}
        </Button>
        <Button
          color="red.500"
          {...getCancelButtonProps()}
          onClick={() => {
            setDraftValue(String(data.v || '-'));
          }}
        >
          {' '}
          x
        </Button>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" alignItems="center">
        <Button
          style={{ borderRadius: '8px', width: '30px', minWidth: '30px' }}
          size="sm"
          color="green.500"
          {...getEditButtonProps()}
        >
          ⚙
        </Button>
      </Flex>
    );
  }
  const { theme } = data;
  const previewValue = data.mask ? maskValue(draftValue) : draftValue;

  if (data.mask) {
    return (
      <div className={styles.setting_input_item}>
        <p className={styles.line} />
        <Flex alignItems="center">
          <span className={styles.rowLabel}>{data.name}</span>
          {maskedEditing ? (
            <>
              <Input
                value={draftValue === '-' ? '' : draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
              />
              <ButtonGroup justifyContent="center" size="sm" alignItems="top">
                <Button
                  color="green.500"
                  onClick={() => {
                    data.c(data.skey, draftValue);
                    setMaskedEditing(false);
                  }}
                >
                  {' '}
                  √{' '}
                </Button>
                <Button
                  color="red.500"
                  onClick={() => {
                    setDraftValue(String(data.v || '-'));
                    setMaskedEditing(false);
                  }}
                >
                  {' '}
                  x
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <div
                className={styles.maskedPreview}
                style={{ color: theme === 'dark' ? '#7ec7ff' : '#2a6699' }}
              >
                {previewValue}
              </div>
              <Flex justifyContent="center" alignItems="center">
                <Button
                  style={{
                    borderRadius: '8px',
                    width: '30px',
                    minWidth: '30px',
                  }}
                  size="sm"
                  color="green.500"
                  onClick={() => {
                    setDraftValue(String(data.v || '-'));
                    setMaskedEditing(true);
                  }}
                >
                  ⚙
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </div>
    );
  }

  return (
    <div className={styles.setting_input_item}>
      <p className={styles.line} />
      <Editable
        textAlign="left"
        defaultValue={data.v || '-'}
        key={data.v}
        fontSize="sm"
        width="100%"
        isPreviewFocusable={false}
        onSubmit={(text) => {
          data.c(data.skey, text);
        }}
      >
        <Flex alignItems="center">
          <span className={styles.rowLabel}>{data.name}</span>
          <EditablePreview
            fontFamily="var(--window-font-family)"
            color={theme === 'dark' ? '#7ec7ff' : '#2a6699'}
            flex="1"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          />
          <Input as={EditableInput} />
          <EditableControls />
        </Flex>
      </Editable>
    </div>
  );
};

export default SettingInputItem;
