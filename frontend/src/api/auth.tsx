import axios from 'axios'


export const currentUser = async (token:any) => await axios.get("http://localhost:8080/api/current-user",  {
    headers: {
        Authorization: `Bearer ${token}`
    }
})

