import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // This component handles the redirect after successful auth
        // For now, we simulate a brief loading state then redirect to dashboard
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingSpinner />
        </div>
    );
};

export default Callback;
