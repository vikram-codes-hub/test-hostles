import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./authcontext";


export const ChatContext = createContext();


const ChatContextProvider = ({ children }) => {

    const [selecteduser, setSelectedUser] = useState(null);
    const [users, setusers] = useState([]);
    const [messages, setmessages] = useState([]);
    const [unseenmessages, setunseenmessages] = useState({});
    const [loading, setLoading] = useState(false);


    const {axios,socket}=useContext(AuthContext)


    const values={

    }

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    );

}

export default ChatContextProvider;