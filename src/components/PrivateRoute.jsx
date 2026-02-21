import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifySuccess } from "../utils/notify";

const PrivateRoute = ({ children, requireEmailVerification = false }) => {
  const { currentUser, loading, sendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState(null);

  // Show success notification when email gets verified
  useEffect(() => {
    if (requireEmailVerification && currentUser?.emailVerified) {
      const hasShownVerification = sessionStorage.getItem(`verification-success-${currentUser.uid}`);
      
      if (!hasShownVerification) {
        notifySuccess("🎉 Email verified successfully! Welcome to CryptoHub.");
        sessionStorage.setItem(`verification-success-${currentUser.uid}`, 'true');
      }
    }
  }, [currentUser?.emailVerified, currentUser?.uid, requireEmailVerification]);

  const handleResend = async () => {
    setResendError(null);
    setResent(false);
    setResending(true);
    try {
      await sendVerificationEmail();
      setResent(true);
    } catch (err) {
      console.error('Resend verification failed:', err);
      setResendError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

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
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>📧 Email Verification Required</h2>
        <p style={{ fontSize: '16px', marginBottom: '12px', maxWidth: '500px' }}>Please verify your email address to access this feature.</p>
        <p style={{ fontSize: '16px', marginBottom: '16px', maxWidth: '500px' }}>Check your <strong>inbox</strong> (and <strong>spam/junk folder</strong>) for the verification link.</p>
        <p style={{ fontSize: '14px', color: '#fbbf24', marginBottom: '20px' }}>⏰ Verification link expires in 24 hours.</p>
        {resendError && (
          <p style={{ color: '#f87171', marginTop: '8px' }}>
            {resendError}
          </p>
        )}
        {resent && !resendError && (
          <div style={{ 
            color: '#22c55e', 
            marginTop: '16px', 
            fontSize: '16px', 
            fontWeight: '600',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>✅ Verification email resent successfully!</span>
            <span style={{ fontSize: '14px', fontWeight: '400' }}>Please check your inbox and spam/junk folder.</span>
          </div>
        )}
        <button
          onClick={handleResend}
          disabled={resending}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: resending ? '#6b7280' : '#8b5cf6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: resending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </button>
        <Link 
          to="/"
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#8b5cf6',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
        >
          Go to Home Page
        </Link>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
