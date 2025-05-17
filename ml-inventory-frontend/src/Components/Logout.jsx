import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check for dark mode class on HTML element
  useEffect(() => {
    const checkDarkMode = () => {
      return document.documentElement.classList.contains('dark');
    };
    
    // Initial check
    const isDark = checkDarkMode();
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Mutation observer to watch for class changes
    const observer = new MutationObserver(() => {
      const darkModeActive = checkDarkMode();
      // You can use this state if needed
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Styles with dark mode selectors
  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      padding: '2rem',
      borderRadius: '8px',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      animation: 'fadeIn 0.3s ease',
    },
    modalTitle: {
      marginTop: 0,
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    modalText: {
      marginBottom: '1.5rem',
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    button: {
      padding: '0.6rem 1.5rem',
      borderRadius: '6px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '1rem',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#f1f5f9',
      color: '#4a5568',
    },
    confirmButton: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    loadingMessage: {
      maxWidth: '500px',
      textAlign: 'center',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    loadingTitle: {
      marginBottom: '1rem',
    },
    // Keyframes and global styles
    globalStyles: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .logout-container {
        background-color: #f8f9fa;
      }
      
      .modal-content {
        background-color: white;
      }
      
      .modal-title {
        color: #193773;
      }
      
      .modal-text {
        color: #4a5568;
      }
      
      .loading-message {
        background-color: white;
      }
      
      .loading-title {
        color: #193773;
      }
      
      /* Dark mode styles */
      html.dark .logout-container {
        background-color: #1a202c;
      }
      
      html.dark .modal-content {
        background-color: #2d3748;
      }
      
      html.dark .modal-title {
        color: #f9fafb;
      }
      
      html.dark .modal-text {
        color: #e2e8f0;
      }
      
      html.dark .loading-message {
        background-color: #2d3748;
      }
      
      html.dark .loading-title {
        color: #f9fafb;
      }
      
      html.dark .cancel-button {
        background-color: #4a5568;
        color: #f9fafb;
      }
    `
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate(-1); 
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="logout-container" style={styles.container}>
      {/* Inject global styles */}
      <style>{styles.globalStyles}</style>
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <h3 className="modal-title" style={styles.modalTitle}>Confirm Logout</h3>
            <p className="modal-text" style={styles.modalText}>Are you sure you want to log out?</p>
            
            <div style={styles.modalActions}>
              <button 
                onClick={handleCancel} 
                className="cancel-button"
                style={{
                  ...styles.button,
                  ...styles.cancelButton,
                  ...(isLoggingOut && styles.disabledButton)
                }}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                style={{
                  ...styles.button,
                  ...styles.confirmButton,
                  ...(isLoggingOut && styles.disabledButton)
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Message */}
      {isLoggingOut && (
        <div className="loading-message" style={styles.loadingMessage}>
          <h2 className="loading-title" style={styles.loadingTitle}>Logging out...</h2>
        </div>
      )}
    </div>
  );
};

export default Logout;