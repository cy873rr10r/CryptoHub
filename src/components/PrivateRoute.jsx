import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requireEmailVerification = false }) => {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#fff'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(139, 92, 246, 0.3)',
          borderTop: '3px solid #8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Debug: Log verification status
  console.log('🔍 Email Verification Check:', {
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    provider: currentUser.providerData?.[0]?.providerId
  });

  // Optional: Check email verification if required
  if (requireEmailVerification && currentUser.emailVerified === false) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h2>Email Verification Required</h2>
        <p>Please verify your email address to access this feature.</p>
        <p>Check your inbox for the verification link.</p>
        <p>Verification period is 24 hours.</p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
