import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserService from "../services/userService";


const usersList = observer(()=>{

    const handleSetActiveDialog = async (item) => {
        const userService = new UserService();

        const dialog = await userService.getActiveDialog(item.username);
        userStore.setActiveDialog(dialog.data);
        const token = localStorage.getItem('userToken');
        userStore.setActiveFriend(item);
    
        if (userStore.socket !== undefined) {
            userStore.socket.close();
            userStore.setSocket(new WebSocket(`ws://172.20.10.3:8000/ws/chat/${dialog.data.id}/?token=${token}`))
        }
        else{
            userStore.setSocket(new WebSocket(`ws://172.20.10.3:8000/ws/chat/${dialog.data.id}/?token=${token}`))
        }
   
    }

    return userStore.users.map((item=>(
            <div onClick={()=>handleSetActiveDialog(item)} style={{
                cursor: 'pointer',
                display:'flex',
                alignItems: 'center',
                padding: 10
            }} key={item.id}> <Space><Avatar size={20} icon={<UserOutlined />} /> <div>{item.username}</div></Space> </div>
        )))
})

export default usersList;