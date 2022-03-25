import {makeAutoObservable} from 'mobx';


class ObservableUserStore {

    users = [];
    user = undefined;
    activeDialog = undefined;
    activeMessages = [];
    friend = undefined;
    socket = undefined;
    dialogs = [];

    notificationSocket = new WebSocket(`ws://172.20.10.3:8000/ws/notifications/?token=${localStorage.getItem('userToken')}`);
  
    constructor() {
        makeAutoObservable(this);
    }

    setDialogById = (dialog) => {
      const index = this.dialogs?.findIndex(item=>item.id == dialog.id);
      this.dialogs[index] = dialog;
    }
    

    setSocket(socket) {
      this.socket = socket;
    }
    
    setUser(user) {
      this.user = user;
    }

    setUsers(users) {
      this.users = users;
    }

    setDialogs(dialogs) {
      this.dialogs = dialogs;
    }

    deleteUser() {
      this.user = undefined
    }

    setActiveFriend(friend) {
      this.friend = friend;
    }

    setActiveDialog(activeDialog) {
      this.activeDialog = activeDialog;
    }

    setActiveMessages(messages) {
      this.activeMessages = messages;
    }

    setNotifcationSocket(socket) {
      this.notificationSocket = socket;
    }

    pushActiveMessages(message) {
      const id = message.dialog;
      const idItem =  this.dialogs.findIndex((item)=>item.id == id);
      this.dialogs[idItem].messages.push(message);
    }
    
  }

  
  export default new ObservableUserStore();
                          