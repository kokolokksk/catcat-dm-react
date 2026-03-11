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
import styles from '../styles/setting.module.scss';

const SettingInputItem = (prop: any | undefined) => {
  const data = {
    ...prop,
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
        <Button color="red.500" {...getCancelButtonProps()}>
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
        onSubmit={(text) => data.c(data.skey, text)}
      >
        <Flex alignItems="center">
          <span className={styles.rowLabel}>{data.name}</span>
          <EditablePreview
            fontFamily="'Avenir Next','PingFang SC','Microsoft YaHei',sans-serif"
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
