import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Descriptions, PageHeader, Tag, Button, Input } from 'antd';
import { HeartTwoTone, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Image } from 'cloudinary-react';

import '../styling/ImageDetails.css';
import Modal from 'antd/lib/modal/Modal';
import EditableTagGroup from '../components/EditableTagGroup';

const ImageDetails = (props) => {
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});
  const [uploader, setUploader] = useState('unknown');
  const [isFav, setIsFav] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState({ 0: [] });

  const match = useRouteMatch();
  const history = useHistory();

  const fetchImage = (id) => {
    fetch(`${process.env.REACT_APP_API}/api/photos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setImage(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchUsername = (id) => {
    fetch(`${process.env.REACT_APP_API}/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUploader(data.username);
      })
      .catch((err) => console.log(err));
  };

  const handleFavClick = (e) => {
    const user = localStorage.getItem('user');
    if (isFav) {
      fetch(
        `${process.env.REACT_APP_API}/api/users/${user}/favorites/remove/${image.id}`,
        {
          method: 'PUT',
        }
      )
        .then(() => {
          setIsFav(false);
          props.setUserFavs(
            [...props.userFavs].filter((item) => item !== image.id)
          );
        })
        .catch((err) => console.log(err));
    } else {
      fetch(
        `${process.env.REACT_APP_API}/api/users/${user}/favorites/add/${image.id}`,
        {
          method: 'PUT',
        }
      )
        .then(() => {
          setIsFav(true);
          props.setUserFavs([...props.userFavs, image.id]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_API}/api/photos/${image.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        history.push('/');
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    const editBody = {};
    if (image.name !== editName) editBody['name'] = editName;
    if (image.description !== editDescription)
      editBody['description'] = editDescription;
    if (image.tags !== editTags[0]) editBody['tags'] = editTags[0];

    fetch(`${process.env.REACT_APP_API}/api/photos/${image.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates: editBody }),
    });
    window.location.reload();
  };

  const handleEditCancel = () => {
    setEditTags({ 0: image.tags });
    setEditName(image.name);
    setEditDescription(image.description);
    setIsEditModalVisible(false);
  };

  const handleEditNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleEditDescriptionChange = (e) => {
    setEditDescription(e.target.value);
  };

  useEffect(() => {
    fetchImage(match.params.id);
  }, [match.params.id]);

  useEffect(() => {
    if (image) {
      fetchUsername(image.uploader);
      if (image.width > image.height) {
        setImageDimensions({ width: '80%' });
      } else {
        setImageDimensions({ height: '100%' });
      }

      setEditName(image.name);
      setEditDescription(image.description);
      setEditTags({ 0: image.tags });
    }
  }, [image]);

  useEffect(() => {
    if (image) setIsFav(props.userFavs.includes(image.id));
  }, [image, props.userFavs]);

  return (
    <div className='image-details'>
      <div className='image-details-header'>
        <PageHeader
          ghost={false}
          onBack={() => history.goBack()}
          title={image ? image.name : 'Loading'}
          subTitle={image ? `by ${uploader}` : 'loading'}
          extra={[
            <div className='button-container'>
              <Button
                onClick={handleFavClick}
                className={props.loginStatus ? '' : 'hidden'}
              >
                <HeartTwoTone twoToneColor={isFav ? '#eb2f96' : null} />
              </Button>
              <div
                className={
                  image &&
                  props.loginStatus &&
                  parseInt(localStorage.getItem('user')) === image.uploader
                    ? null
                    : 'hidden'
                }
              >
                <Button onClick={handleEdit}>
                  <EditOutlined />
                </Button>
                <Button onClick={handleDelete} type='primary' danger>
                  <DeleteOutlined />
                </Button>
                <Modal
                  title={'Edit Image'}
                  visible={isEditModalVisible}
                  onOk={handleEditOk}
                  onCancel={handleEditCancel}
                >
                  Name:{' '}
                  <Input onChange={handleEditNameChange} value={editName} />
                  Description:{' '}
                  <Input
                    onChange={handleEditDescriptionChange}
                    value={editDescription}
                  />
                  Tags:{' '}
                  <EditableTagGroup
                    ImageTags={editTags}
                    setImageTags={setEditTags}
                    imageNumber={0}
                  />
                </Modal>
              </div>
            </div>,
          ]}
        >
          <Descriptions size='small' column={1}>
            <Descriptions.Item label='Description'>
              {image ? image.description : ''}
            </Descriptions.Item>
            <Descriptions.Item label='Dimensions'>
              {image ? `${image.width} x ${image.height}` : ''}
            </Descriptions.Item>
            <Descriptions.Item label='Tags'>
              {image ? (
                <>
                  {image.tags.map((value, i) => {
                    return <Tag key={i}>{value}</Tag>;
                  })}
                </>
              ) : (
                <></>
              )}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
      {image ? (
        <>
          <div
            className='image-display'
            style={{ maxWidth: '1024px', width: '100%', height: '60vh' }}
          >
            <Image
              cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
              publicId={image.public_id}
              style={{ ...imageDimensions }}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ImageDetails;
