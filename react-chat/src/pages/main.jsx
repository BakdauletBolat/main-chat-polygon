import React, { useState, useEffect } from "react";
import UserService from "../services/userService";
import userStore from "../stores/userStore";
import UsersList from "../components/usersList";
import { PageHeader } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Input, Button } from 'antd';
import { observer } from "mobx-react-lite";
import Messages from "../components/messages";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;



const MessageCreate = () => {

  const [message, setMessage] = useState('');


  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  }

  const handleClickSendButton = async (e) => {

    userStore.socket.send(JSON.stringify({
      'sender_id': userStore.user.id,
      'message': message
    }));
    setMessage('');
  }

  const handleClickSend = (e) => {

    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      userStore.socket.send(JSON.stringify({
        'sender_id': userStore.user.id,
        'message': message
      }));
      setMessage('');
    }

  }

  return <div style={{
    position: 'sticky',
    bottom: 10,
    left: 5,
    width: 'calc(100% - 10px)',

  }}>
    <div style={{
      display: 'flex',
    }}>
      <Input value={message} onKeyDown={handleClickSend} onChange={handleChangeMessage} />
      <Button onClick={handleClickSendButton} type="primary">Отправить</Button>
    </div>
  </div>
}


const ContentBlock = observer(() => {

  if (userStore.activeDialog == undefined) {
    return ''
  }

  if (userStore.socket !== undefined) {
    userStore.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      if (data.type == 'message') {
        userStore.pushActiveMessages(message);
      }
      
    }
  }

  return <>
    <PageHeader
      className="site-page-header"
      onBack={() => userStore.setActiveDialog(undefined)}
      title={userStore.friend?.username}
      subTitle="Сообщение"
    />
    <div style={{
      height: '60vh',
      background: 'white',
      position: 'relative',
      width: '100%',
      overflow: 'scroll',
      padding: '20px 20px 0px 20px'
    }}>
      <Messages></Messages>
      <MessageCreate></MessageCreate>
    </div>
  </>
});

export default function Main() {

  const userService = new UserService();

  const getUsers = async () => {
    const users = await userService.getUsers();
    userStore.setUsers(users.data)
  }

  const ConnectWebSocker = observer(()=>{
    if (userStore.user !== undefined) {
      if (userStore.mainSocket !== undefined) {
        mainSocket.close();
      }
      const token = localStorage.getItem('userToken');
      const mainSocket = new WebSocket(`ws://172.20.10.3:8000/ws/chat/${userStore.user?.username}/?token=${token}`);
      userStore.setMainSocket(mainSocket);
    }
    return <></>
    
  });

  useEffect(() => {
    getUsers();
    
  }, []);



  return (
    <Content style={{ padding: '0 50px' }}>
      <ConnectWebSocker></ConnectWebSocker>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <UsersList></UsersList>
            </SubMenu>

          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <ContentBlock></ContentBlock>
        </Content>
      </Layout>
    </Content>
  );
}

