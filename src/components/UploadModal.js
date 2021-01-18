import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Pagination, Steps, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import EditableTagGroup from '../components/EditableTagGroup';

const { Step } = Steps;

const UploadModal = (props) => {
  //steps state
  const [uploadProgress, setUploadProgress] = useState(0);
  // Image wall state
  const [fileList, setFileList] = useState([]);
  // Image details info
  const [imageDetailsPage, setImageDetailsPage] = useState(0);
  const [imageNames, setImageNames] = useState({});
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [imageTags, setImageTags] = useState({});

  // Image data for postgres db
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    console.log(fileList, imageNames, imageDescriptions, imageTags, imageData);
    if (imageData.length === fileList.length && imageData.length > 0) {
      for (const image of imageData) {
        console.log(image);
        fetch(`${process.env.REACT_APP_API}/api/photos/upload`, {
          method: 'POST',
          body: JSON.stringify(image),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
    }
  }, [imageData]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleUploadNext = () => {
    console.log(fileList);
    if (uploadProgress === 1) {
      fetch(`${process.env.REACT_APP_API}/api/auth/signature`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const { signature, timestamp } = data;
          const form = new FormData();
          for (let i = 0; i < fileList.length; i++) {
            let file = fileList[i];
            form.append('file', file.originFileObj);
            form.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);
            form.append('timestamp', timestamp);
            form.append('signature', signature);

            fetch(
              `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                method: 'POST',
                body: form,
              }
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                const thisImage = {
                  public_id: data.public_id,
                  name: imageNames[i] || 'no name',
                  image_path: data.secure_url,
                  height: data.height,
                  width: data.width,
                  description: imageDescriptions[i] || 'no description',
                  tags: imageTags[i] || [],
                  uploader: localStorage.getItem('user'),
                };
                setImageData((imageData) => [...imageData, thisImage]);
                console.log('updated image data', imageData);
              });
          }
        });
    }
    setUploadProgress(uploadProgress + 1);
  };

  const handleUploadPrevious = () => {
    setUploadProgress(uploadProgress - 1);
  };

  const handleUploadOk = () => {
    window.location.reload();
  };

  const handleUploadCancel = () => {
    props.handleUploadOnCancel();
    setFileList([]);
    setImageDescriptions({});
    setImageNames({});
    setImageTags({});
    setUploadProgress(0);
    setImageDetailsPage(0);
  };

  const handlePageChange = (page) => {
    setImageDetailsPage(page - 1);
    console.log(page - 1, fileList[page - 1]);
  };

  const handleNameChange = (event) => {
    setImageNames({ ...imageNames, [imageDetailsPage]: event.target.value });
  };

  const handleDescriptionChange = (event) => {
    setImageDescriptions({
      ...imageDescriptions,
      [imageDetailsPage]: event.target.value,
    });
  };

  return (
    <>
      <Modal
        title='Upload Images'
        visible={props.isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={[
          <Button
            key='previous'
            onClick={handleUploadPrevious}
            className={uploadProgress !== 2 ? null : 'hidden'}
            disabled={uploadProgress === 0}
          >
            Previous
          </Button>,

          <Button
            key='next'
            onClick={handleUploadNext}
            className={uploadProgress !== 2 ? null : 'hidden'}
            disabled={uploadProgress === 2 || fileList.length === 0}
          >
            Next
          </Button>,
          <Button
            key='close'
            type='primary'
            onClick={handleUploadOk}
            className={uploadProgress === 2 ? null : 'hidden'}
            disabled={uploadProgress !== 2}
          >
            Close
          </Button>,
        ]}
      >
        <Steps progressDot current={uploadProgress}>
          <Step title='Choose Images' />
          <Step title='Add Details' />
          <Step title='Finish' />
        </Steps>

        {uploadProgress === 0 ? (
          <Upload
            accept={'image/png, image/jpg'}
            listType='picture-card'
            fileList={fileList}
            showUploadList={{ showPreviewIcon: false }}
            onChange={handleUploadChange}
            beforeUpload={() => false}
          >
            {fileList.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        ) : null}

        {uploadProgress === 1 ? (
          <>
            {fileList.map((image, i) => {
              return (
                <div
                  key={i}
                  className={
                    imageDetailsPage === i
                      ? 'image-details-container'
                      : 'hidden'
                  }
                >
                  <img src={image.thumbUrl} alt={image.name} />
                  <div className='image-details-form'>
                    Name:
                    <Input onChange={handleNameChange} />
                    Description:
                    <Input onChange={handleDescriptionChange} />
                    <EditableTagGroup
                      ImageTags={imageTags}
                      setImageTags={setImageTags}
                      imageNumber={i}
                    />
                  </div>
                </div>
              );
            })}
            <div className='pagination-container'>
              <Pagination
                simple
                onChange={handlePageChange}
                total={fileList.length}
                defaultPageSize={1}
              />
            </div>
          </>
        ) : null}

        {uploadProgress === 2 ? <></> : null}
      </Modal>
    </>
  );
};

export default UploadModal;
