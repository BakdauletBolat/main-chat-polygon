import {makeAutoObservable} from 'mobx';

class MessageObservableStore {

    activeMessages = [];

    constructor() {
        makeAutoObservable(this);
    }

    setActiveMessages(activeMessages) {
        this.activeMessages = activeMessages;
    }

}

export default new MessageObservableStore();