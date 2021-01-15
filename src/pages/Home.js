import React, { useState, useEffect } from 'react';
import JustifiedGrid from 'react-justified-grid';
import { useHistory } from 'react-router-dom';

import { Image } from 'cloudinary-react';

import '../styling/Home.css';
import Transformation from 'cloudinary-react/lib/components/Transformation';
import { PageHeader, Button, Tooltip, Select, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import UploadModal from '../components/UploadModal';

const Home = (props) => {
  const history = useHistory();
  const { Option } = Select;
  const { Search } = Input;
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all-images');

  // props for upload modal
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const handleUploadOnCancel = () => {
    setIsUploadModalVisible(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (value, event) => {
    setSearchType(value);
  };

  const handleSearch = () => {
    fetch(`${process.env.REACT_APP_API}/api/photos/search`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_term: searchTerm,
        search_type: searchType,
        user: localStorage.getItem('user'),
      }),
    })
      .then((res) => res.json())
      .then((searchResults) => {
        setImages(
          searchResults.rows.map((pic) => {
            return {
              src: pic.image_path,
              height: pic.height,
              width: pic.width,
              public_id: pic.public_id,
              uploader: pic.uploader,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const fetchImages = (imageList = null) => {
    let fetch_url = '';
    if (!imageList) {
      fetch_url = `${process.env.REACT_APP_API}/api/photos/all`;
    } else {
      imageList = imageList.map((id) => id.toString());
      fetch_url =
        `${process.env.REACT_APP_API}/api/photos/batch/` + imageList.join(',');
    }
    fetch(fetch_url)
      .then((res) => res.json())
      .then((data) => {
        setImages(
          data.map((pic) => {
            return {
              src: pic.image_path,
              height: pic.height,
              width: pic.width,
              public_id: pic.public_id,
              uploader: pic.uploader,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handlePicClick = (event) => {
    const public_id = event.target.getAttribute('id');
    history.push(`/image/${public_id}`);
  };

  return (
    <>
      <div className='home-page-header'>
        <PageHeader
          backIcon={false}
          title='Image Repository'
          extra={[
            <Tooltip
              title='Login to use this feature'
              trigger={props.loginStatus ? [] : 'hover'}
              key='tooltip'
            >
              <Button
                disabled={!props.loginStatus}
                icon={<UploadOutlined />}
                onClick={() => setIsUploadModalVisible(true)}
              >
                Upload Image
              </Button>
            </Tooltip>,
          ]}
        >
          {/* Add search and upload stuff here */}
          <Search
            placeholder='search images'
            onSearch={handleSearch}
            onChange={handleSearchTermChange}
            addonBefore={
              <Select
                defaultValue='all-images'
                onChange={handleSearchTypeChange}
              >
                <Option value='all-images'>All Images</Option>
                {props.loginStatus && (
                  <>
                    <Option value='my-favs'>My Favorites</Option>
                    <Option value='my-uploads'>My Uploads</Option>
                  </>
                )}
              </Select>
            }
          />
          <UploadModal
            isUploadModalVisible={isUploadModalVisible}
            handleUploadOnCancel={handleUploadOnCancel}
            userId={localStorage.getItem('user')}
          />
        </PageHeader>
      </div>
      <JustifiedGrid
        className='grid-container'
        images={images}
        rows={20}
        maxRowHeight={256}
        showIncompleteRow={true}
        gutter={5}
      >
        {(processedImages) => (
          <React.Fragment>
            {processedImages.map((image, i) => {
              const { width, height, left, top, originalData } = image;
              return (
                <div
                  key={i}
                  style={{ position: 'absolute', left: left, top: top }}
                >
                  <Image
                    id={originalData.public_id}
                    cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                    public_id={originalData.public_id}
                    width={width}
                    height={height}
                    onClick={handlePicClick}
                    loading='lazy'
                  >
                    <Transformation crop='scale' width='512' />
                  </Image>
                </div>
              );
            })}
          </React.Fragment>
        )}
      </JustifiedGrid>
    </>
  );
};

export default Home;
