import React, { useState, useEffect } from "react";
import UserService from "../services/userService";
import userStore from "../stores/userStore";
import UsersList from "../components/usersList";
import { PageHeader } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Input, Button } from 'antd';
import { observer } from "mobx-react-lite";
import Messages from "../components/messages";
import MessageCreate from '../components/messageCreate';
const { Content, Sider } = Layout;



const ContentBlock = observer(() => {

  if (userStore.activeDialog == undefined) {
    return ''
  }

  if (userStore.socket !== undefined) {
    userStore.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      if (data.type == 'message') {
        if (message.sender !== userStore.user.id) {
          userStore.pushActiveMessages(message);
        }  
      }

    }
  }

  const getActiveDialogById = (id) => {
    const index = userStore.dialogs?.findIndex(item=>item.id == id);
    return userStore.dialogs[index];
}


  const getUserName = (item) => {
    if (item.owner?.id == userStore.user?.id) {
        return item.opponent?.username
    }
    else {
        return item.owner?.username
    }
}


  return <>
    <PageHeader
      className="site-page-header"
      onBack={() => userStore.setActiveDialog(undefined)}
      title={getUserName(getActiveDialogById(userStore.activeDialog))}
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

  const getDialogs = async () => {
    const dialogs = await userService.getDialogs();
    console.log(dialogs.data);
    userStore.setDialogs(dialogs.data);
  }

  

  useEffect(() => {
    getDialogs();
    
  }, []);



  return (
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={360} style={{background: 'white'}}>
          <div>
            <UsersList></UsersList>
          </div>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <ContentBlock></ContentBlock>
        </Content>
      </Layout>
    </Content>
  );
}

