import React, {useState} from 'react';
import userStore from '../stores/userStore';
import { Input, Button, message } from 'antd';
import UserService from '../services/userService';

const MessageCreate = () => {

    const [message, setMessage] = useState('');

    const getUserId = (item) => {
        if (item.owner?.id == userStore.user?.id) {
            return item.opponent?.id;
        }
        else {
            return item.owner?.id;
        }
    }

    const getActiveDialogById = (id) => {
        const index = userStore.dialogs?.findIndex(item=>item.id == id);
        return userStore.dialogs[index];
    }
    
  
    const handleChangeMessage = (event) => {
      setMessage(event.target.value);
    }
  
    const handleClickSendButton = async (e) => {

      const usersService = new UserService();


      const messageItem = await usersService.createMessage({
          text:message,
          dialog_id:userStore.activeDialog
      })
  
      userStore.socket.send(JSON.stringify({
        'message': messageItem,
        'receiver_id': getUserId(getActiveDialogById(userStore.activeDialog))
      }));
  
      userStore.notificationSocket.send(JSON.stringify({
        'message': messageItem,
        'receiver_id': getUserId(getActiveDialogById(userStore.activeDialog))
      }));
      

      userStore.pushActiveMessages(messageItem);
      
      setMessage('');
    }
  
    const handleClickSend =  async (e,type)  => {
      if (e.keyCode === 13 && e.shiftKey === false) {
        e.preventDefault();
        const usersService = new UserService();


      const messageItem = await usersService.createMessage({
          text:message,
          dialog:userStore.activeDialog
      })
  
      userStore.socket.send(JSON.stringify({
        'message': messageItem.data,
        'receiver_id':  getUserId(getActiveDialogById(userStore.activeDialog))
      }));
  
      userStore.notificationSocket.send(JSON.stringify({
        'message': messageItem.data,
        'receiver_id':  getUserId(getActiveDialogById(userStore.activeDialog))
      }));
      

      userStore.pushActiveMessages(messageItem.data);
      
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

  export default MessageCreate;