import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserService from "../services/userService";


const usersList = observer(() => {


    const getUserName = (item) => {
        if (item.owner?.id == userStore.user?.id) {
            return item.opponent?.username
        }
        else {
            return item.owner?.username
        }
    }

    const getActiveDialogById = (id) => {
        const index = userStore.dialogs?.findIndex(item => item.id == id);
        return userStore.dialogs[index];
    }

    const getLastMessage = (item) => {
        const length = getActiveDialogById(item.id).messages.length;

        if (length !== 0) {
            if (getActiveDialogById(item.id).messages[length - 1].sender == userStore.user?.id) {
                return `Вы: ${getActiveDialogById(item.id).messages[length - 1].text}`
            }
            return getActiveDialogById(item.id).messages[length - 1].text;
        }

        return ''

    }

    const handleSetActiveDialog = async (item) => {
        userStore.setActiveDialog(item.id);
        const userService = new UserService();
        const dialog = await userService.getActiveDialog(item.id);

        userStore.setDialogById(dialog.data);
        const token = localStorage.getItem('userToken');

        if (userStore.socket !== undefined) {
            userStore.socket.close();
            userStore.setSocket(new WebSocket(`ws://172.20.10.3:8000/ws/chat/${item.id}/?token=${token}`))
        }
        else {
            userStore.setSocket(new WebSocket(`ws://172.20.10.3:8000/ws/chat/${item.id}/?token=${token}`))
        }

    }

    const dateTime = (date) => {
        var options = { minute: 'numeric', hour: 'numeric' };
        return date.toLocaleTimeString('ru-Ru', options)
    }

    const getCountNotReaded = (item) => {
        const count = item.messages.filter(item=>item.read == false && item.sender !== userStore.user?.id).length
        return count;
      }

    return userStore.dialogs.map((item => (
        <div onClick={() => handleSetActiveDialog(item)} style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            borderBottom: '1px solid rgba(0,0,0,0.2)'
        }} key={item.id}>
            <div style={{
                display:'flex',
                alignItems: 'center'
            }}>
            <Avatar size={40} icon={<UserOutlined />} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 8
            }}>
                <div style={{
                    fontSize: 14,
                    fontWeight: 700
                }}>{getUserName(item)}</div>
                
                <div style={{
                    fontSize: 12,
                    color: '#7A7A7A'
                }}>{getLastMessage(item)}</div>
            </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                {getCountNotReaded(item) > 0 ?  (
                    <div style={
                        {
                            width: 20,
                            fontSize: 12,
                            height: 20,
                            display: 'flex',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            backgroundColor: '#FF3742'
                        }
                    }>{getCountNotReaded(item)}</div>
                ): '' }
                <div style={{
                    fontSize: 12,
                    color: '#7A7A7A'
                }}>{dateTime(new Date(getLastMessage(item).created_at))}</div>
            </div>
        </div>
    )))
})

export default usersList;