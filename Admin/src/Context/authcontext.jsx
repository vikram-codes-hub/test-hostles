import React, { createContext, use, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContextProvider = ({ children }) => {
 

    const [token, settoken] = useState(localStorage.getItem("token"));
    

    const login=   async ( credentials) => {
        try {
            const {data}=await axios.post('api/auth/login', credentials)
            if(data.success){
                axios.defaults.headers.common["token"]=data.token;
                settoken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.msg || "Login successful");
            }  else {
                toast.error(data.msg || "Something went wrong");
            }
              return data
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }

    const logout=()=>{
        localStorage.removeItem("token");
        settoken(null);
        delete axios.defaults.headers.common["token"];
        toast.success("Logged out successfully");
    }

    const addproduct=async(payload)=>{
        try {
           const { data } = await axios.post('/api/hostel/addhostel', payload, {headers: { 'Content-Type': 'multipart/form-data',token: localStorage.getItem("token") }});


        if(data.success){
            toast.success("Product added successfully");
        }else{
            toast.error(data.mssg || "Something went wrong");
        } 
        return { data }; 
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
            
        }
    }

    //remove hostel
    const removeHostel = async (id) => {
        try {
            const { data } = await axios.post('/api/hostel/remove', { id });
            if(data.success){
                toast.success("Hostel removed successfully");   
            }
            else{
                toast.error(data.mssg || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }

    //list all hostel of admin
    const listHostels = async () => {
        try {   
            const { data } = await axios.get('/api/hostel/listhostels');
            if(data.success){
                return data.hostel;
            } else {
                toast.error(data.mssg || "Something went wrong");
            }
        }
        catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }   
    }

    //single hostel info
    const getSingleHostelInfo = async (id) => {
        try {
            const { data } = await axios.get(`/api/hostel/singelhostelinfo?id=${id}`);
            if(data.success){
                return data.hostel;
            } else {
                toast.error(data.mssg || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }



    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
    }, [token]);

 const values={
        token,login,logout,addproduct,removeHostel,listHostels,getSingleHostelInfo
    }
return (

   
    <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
)

  }

  export default AuthContextProvider;