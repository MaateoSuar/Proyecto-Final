// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io("http://localhost:5000", {
            auth: { token }
        });

        newSocket.on('connect', () => {
            setSocket(newSocket);
            setReady(true);
        });

        return () => {
            newSocket.disconnect();
            setReady(false);
        };
    }, []);

    return (
        <SocketContext.Provider value={ready ? socket : null}>
            {children}
        </SocketContext.Provider>
    );
};
