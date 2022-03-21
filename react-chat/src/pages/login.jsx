import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import UserService from "../services/userService";
import userStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const Login = observer(() => {

  const userService = new UserService();
  const navigation = useNavigate();
  

  useEffect(()=>{
    if (userStore.user !== undefined) {
      navigation('/');
    }
  },[userStore.user])

  
  const getUser = async ()  => {
    const user = await userService.getUser();
     userStore.setUser(user.data);

  }

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      await userService.login(values);
      getUser();
    }

    catch (e) {
      console.log(e);
    }
    
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 2,
      }}
      wrapperCol={{
        span: 8,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
});

export default Login;