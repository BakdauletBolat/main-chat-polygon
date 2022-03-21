import axios from 'axios';

class UserService {
    url = 'http://172.20.10.3:8000/chat'

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

    async getActiveDialog(name) {
        const token = "Bearer " +localStorage.getItem('userToken');
        const headers = {
            'Authorization': token
        }

        try {
           return await axios.get(`${this.url}/${name}/`,{
               headers: headers
           });
        }
        catch (e) {
            console.log(e,'err');
        }  
    }
}


export default UserService;