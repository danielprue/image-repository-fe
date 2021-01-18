import { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';

import { Form, Button, Input, Layout, Menu, Modal } from 'antd';
import { HomeOutlined, GithubOutlined } from '@ant-design/icons';

import Home from './pages/Home';
import ImageDetails from './pages/ImageDetails';

import './styling/App.css';
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

function App() {
  // state
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(
    false
  );
  const [loginStatus, setLoginStatus] = useState(false);
  const [userFavs, setUserFavs] = useState([]);
  const [form] = Form.useForm();

  const history = useHistory();

  // useEffect
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API}/api/auth/verify/${token}`)
        .then((res) => res.json())
        .then((status) => {
          if (status.expired) {
            localStorage.removeItem('token');
            localStorage.removeItem('isGuest');
            localStorage.removeItem('user');
          } else {
            setLoginStatus(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (loginStatus) {
      let user = localStorage.getItem('user');
      fetch(`${process.env.REACT_APP_API}/api/users/${user}/favorites`)
        .then((res) => res.json())
        .then((favs) => {
          setUserFavs(favs.map((image) => image.id));
        })
        .catch((err) => console.log(err));
    }
  }, [loginStatus]);

  // Button handlers
  const handleHomeClick = () => {
    history.push('/');
  };

  const handleClickLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleLogout = () => {
    if (localStorage.getItem('isGuest')) {
      fetch(
        `${process.env.REACT_APP_API}/api/auth/guest/${localStorage.getItem(
          'user'
        )}`,
        {
          method: 'DELETE',
        }
      );
    }

    setLoginStatus(false);
    setUserFavs([]);
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('user');

    window.location.reload();
  };

  const handleLoginSubmit = (values) => {
    fetch(`${process.env.REACT_APP_API}/api/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', result.id);
          setLoginStatus(true);
          handleOnCancel();
        } else {
          form.setFields([
            {
              name: 'username',
              value: '',
              errors: ['Username and Password do not match'],
            },
            {
              name: 'password',
              value: '',
              errors: ['Username and Password do not match'],
            },
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegisterSubmit = (values) => {
    fetch(`${process.env.REACT_APP_API}/api/auth/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', res.id);
          setLoginStatus(true);
        }
        handleOnCancel();
      })
      .catch((err) => console.log(err));
  };

  const handleClickRegisterModal = () => {
    setIsRegistrationModalVisible(true);
  };

  const handleOnCancel = () => {
    form.resetFields();
    setIsLoginModalVisible(false);
    setIsRegistrationModalVisible(false);

    const selected = document.querySelector('.ant-menu-item-selected');
    if (selected) selected.classList.remove('ant-menu-item-selected');
  };

  const handleCreateGuest = () => {
    fetch(`${process.env.REACT_APP_API}/api/auth/guest/create`)
      .then((res) => res.json())
      .then((result) => {
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', result.id);
          localStorage.setItem('isGuest', true);

          setLoginStatus(true);
          window.location.reload();
        }
      });
  };

  // render component
  return (
    <div className='App'>
      <Layout className='layout'>
        <Header className='header'>
          <div className='header-container'>
            <HomeOutlined className='home-icon' onClick={handleHomeClick} />
            <div className='login-buttons'>
              <Menu theme='dark' mode='horizontal'>
                {!loginStatus ? (
                  <>
                    <Menu.Item key='login-menu' onClick={handleClickLoginModal}>
                      Login
                    </Menu.Item>
                    <Modal
                      title='Login'
                      visible={isLoginModalVisible}
                      footer={null}
                      onCancel={handleOnCancel}
                    >
                      <Form
                        name='login'
                        form={form}
                        initialValues={{}}
                        layout='vertical'
                        onFinish={handleLoginSubmit}
                      >
                        <Form.Item
                          label='Username'
                          name='username'
                          validateTrigger='onBlur'
                          rules={[
                            { required: true, message: 'Username is Required' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label='Password'
                          name='password'
                          validateTrigger='onBlur'
                          rules={[
                            { required: true, message: 'Password is Required' },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Button type='primary' htmlType='submit'>
                          Submit
                        </Button>
                      </Form>
                    </Modal>
                    <Menu.Item
                      key='register-menu'
                      onClick={handleClickRegisterModal}
                    >
                      Register
                    </Menu.Item>
                    <Modal
                      title='Register'
                      visible={isRegistrationModalVisible}
                      footer={null}
                      onCancel={handleOnCancel}
                    >
                      <Form
                        name='register'
                        form={form}
                        initialValues={{}}
                        layout='vertical'
                        onFinish={handleRegisterSubmit}
                      >
                        <Form.Item
                          label='Username'
                          name='username'
                          validateTrigger='onBlur'
                          rules={[
                            { required: true, message: 'Username is Required' },
                            () => ({
                              async validator(_, value) {
                                let userquery;
                                await fetch(
                                  `${process.env.REACT_APP_API}/api/users/name/${value}`
                                )
                                  .then((res) => res.json())
                                  .then((data) => {
                                    userquery = data;
                                  })
                                  .catch((err) => console.log(err));
                                if (!value || userquery.length === 0)
                                  return Promise.resolve();
                                else
                                  return Promise.reject(
                                    'Username not available'
                                  );
                              },
                            }),
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label='Password'
                          name='password'
                          validateTrigger='onBlur'
                          rules={[
                            { required: true, message: 'Password is Required' },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          label='Confirm Password'
                          name='confirm-password'
                          validateTrigger='onBlur'
                          rules={[
                            { required: true, message: 'Password is Required' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue('password') === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  'Your passwords do not match'
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Button type='primary' htmlType='submit'>
                          Submit
                        </Button>
                      </Form>
                    </Modal>
                    <Menu.Item key='guest-account' onClick={handleCreateGuest}>
                      Guest Account
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item key='logout' onClick={handleLogout}>
                      Logout
                    </Menu.Item>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </Header>
        <Content>
          <Route exact path='/'>
            <Home loginStatus={loginStatus} />
          </Route>

          <Route path='/image/:id'>
            <ImageDetails
              loginStatus={loginStatus}
              userFavs={userFavs}
              setUserFavs={setUserFavs}
            />
          </Route>
        </Content>
        <Footer className='footer'>
          <a
            href='https://github.com/danielprue/image-repository-be'
            className='github-icon-link'
          >
            <GithubOutlined className='github-icon' />
          </a>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
