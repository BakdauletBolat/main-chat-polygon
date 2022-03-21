import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate
} from "react-router-dom";

import './index.css';
import Main from "./pages/main";
import ChatList from "./pages/chatlist";
import Login from "./pages/login";

import { Layout, Menu, Breadcrumb } from 'antd';
import UserService from "./services/userService";
import userStore from "./stores/userStore";
import { observer } from 'mobx-react-lite';


const { Header, Content, Footer } = Layout;



const MenuItems = observer(() => {
  const userService = new UserService();

  const logoutUser = () => {
    userService.logoutUser();
    userStore.deleteUser();
  }

  return (
    <Menu theme="dark" mode="horizontal">
      {userStore.user !== undefined && <Menu.Item key={0}>{userStore.user?.username}</Menu.Item>}
      <Menu.Item key={1}><Link to="/">Main</Link></Menu.Item>
      <Menu.Item key={2}><Link to="/login">Login</Link></Menu.Item>
      <Menu.Item key={3}><Link to="/chat">Chat</Link></Menu.Item>
      {userStore.user !== undefined && <Menu.Item key={4} onClick={logoutUser}>Logout</Menu.Item>}
    </Menu>
  )
})

function App() {


  const userService = new UserService();

  const getUser = async () => {
    const user = await userService.getUser();
    userStore.setUser(user.data);

  }



  useEffect(() => {
    getUser();
  }, [userStore.user])

  return <>
    <Router>
    <Layout>
    <Header className="header">
      <div className="logo" />
      <MenuItems></MenuItems>
    </Header>
    <Routes>
          <Route path="/" element={<Main></Main>}>
          </Route>
          <Route path="/login" element={<Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Login</Breadcrumb.Item>
            </Breadcrumb>
            <Login />
          </Content>}>
          </Route>
          <Route path="/chat" element={<Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Chat</Breadcrumb.Item>
            </Breadcrumb>
            <ChatList />
          </Content>
          }>
          </Route>
        </Routes>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
    
    </Router>
  </>
}

export default App;


