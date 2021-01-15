import { Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';

const EditableTagGroup = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  let textInput = useRef(null);

  useEffect(() => {
    if (textInput.current) textInput.current.focus();
  }, [inputVisible, textInput]);

  const handleClose = (removedTag) => {
    const tags = props.ImageTags[props.imageNumber].filter(
      (tag) => tag !== removedTag
    );
    props.setImageTags({ ...props.ImageTags, [props.imageNumber]: tags });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirmation = () => {
    let tags = props.ImageTags[props.imageNumber] || [];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    props.setImageTags({ ...props.ImageTags, [props.imageNumber]: tags });
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag) => {
    const tagElem = (
      <span className='tag-group-tag'>
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      </span>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  return (
    <>
      <div style={{ marginBottom: 12, lineHeight: 2.5 }}>
        {props.ImageTags[props.imageNumber]
          ? props.ImageTags[props.imageNumber].map(forMap)
          : null}
      </div>
      {inputVisible && (
        <Input
          ref={textInput}
          type='text'
          size='small'
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirmation}
          onPressEnter={handleInputConfirmation}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className='site-tag-plus'>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default EditableTagGroup;
