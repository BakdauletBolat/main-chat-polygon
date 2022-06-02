import axios from 'axios';

class UserService {
    url = 'http://192.168.18.14:8000/chat'

    async login(data) {
        try {
            const res = await axios.post(`${this.url}/login/`,data);
            localStorage.setItem('userToken',res.data.access);
            return res.data;
        }
        catch (e) {
            console.log(e);      
        }      
    }

    async getUser() {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.get(`${this.url}/me/`,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        }    
    }

    async createMessage(body) {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.post(`${this.url}/create-message/`,body,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        } 
    }

    async getDialogs() {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.get(`${this.url}/dialogs/`,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        } 
    }

    async getUsers() {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.get(`${this.url}/users/`,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        }   
    }

    async logoutUser() {
        localStorage.removeItem('userToken');
    }

    async getActiveDialog(id) {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.get(`${this.url}/dialog/${id}/`,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        }  
    }
}


export default UserService;