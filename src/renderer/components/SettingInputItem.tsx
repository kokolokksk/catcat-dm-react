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
      <ButtonGroup justifyContent="center" size="sm">
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
      <Flex justifyContent="center">
        <Button size="sm" color="green.500" {...getEditButtonProps()}>
          🐱
        </Button>
      </Flex>
    );
  }
  return (
    <div className={styles.setting_input_item}>
      <p className={styles.line} />
      <Editable
        textAlign="center"
        defaultValue={data.v || '-'}
        key={data.v}
        fontSize="xl"
        width="80%"
        isPreviewFocusable={false}
        onSubmit={(text) => data.c(data.skey, text)}
      >
        {/* Here is the custom input */}
        <Flex>
          {data.name}:
          <EditablePreview fontFamily="consolas" color="orange" />
          {/* width='50%' overflow='hidden' display='inline' */}
          <Input as={EditableInput} />
          <EditableControls />
        </Flex>
      </Editable>
    </div>
  );
};

export default SettingInputItem;
