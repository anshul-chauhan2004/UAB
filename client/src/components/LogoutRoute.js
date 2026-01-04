import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutRoute = ({ children }) => {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, []);

    return <>{children}</>;
};

export default LogoutRoute;
