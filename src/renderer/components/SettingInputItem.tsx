/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  useColorMode,
  useEditableControls,
} from '@chakra-ui/react';
import styles from '../styles/setting.module.scss';

const SettingInputItem = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  const { colorMode, toggleColorMode } = useColorMode();
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
          <EditablePreview
            fontFamily="consolas"
            color={colorMode === 'dark' ? 'orange' : 'teal'}
            maxWidth="50%"
            overflowWrap="initial"
            overflow="hidden"
          />
          {/* width='50%' overflow='hidden' display='inline' */}
          <Input as={EditableInput} />
          <EditableControls />
        </Flex>
      </Editable>
    </div>
  );
};

export default SettingInputItem;
