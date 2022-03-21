import {makeAutoObservable} from 'mobx';

class ObservableUserStore {

    users = [];
    user = undefined;
    activeDialog = undefined;
    activeMessages = [];
    socket = undefined;
    mainSocket = undefined;
    friend = undefined;
  
    constructor() {
        makeAutoObservable(this);
    }


    setMainSocket(socket) {
      this.mainSocket = socket;
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

    pushActiveMessages(message) {
      console.log(message);
      this.activeDialog.messages.push(message);
    }
    
  }
  
  export default new ObservableUserStore();
                          