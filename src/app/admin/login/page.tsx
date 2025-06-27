'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkCookies = () => {
    const cookies = document.cookie;
    console.log('All cookies:', cookies);
    const tokenMatch = cookies.match(/(?:^|; )token=([^;]*)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    console.log('Token found in cookies:', token ? token.substring(0, 20) + '...' : 'No token');
    return token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Form submitted with:', { username, password });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      
      console.log('Login successful, checking cookies...');
      
      // Wait a bit for cookie to be set, then check
      setTimeout(() => {
        const token = checkCookies();
        if (token) {
          console.log('Token found, redirecting to dashboard...');
          console.log('Using Next.js router to redirect...');
          try {
            router.push('/admin/dashboard');
            console.log('Router.push called successfully');
          } catch (routerError) {
            console.error('Router error:', routerError);
            console.log('Falling back to window.location...');
            window.location.href = '/admin/dashboard';
          }
        } else {
          console.error('No token found after login!');
          setError('Login successful but token not set. Please try again.');
        }
      }, 500); // Increased timeout

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestClick = () => {
    console.log('Test button clicked!');
    checkCookies();
    console.log('Testing manual redirect...');
    router.push('/admin/dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '24px', 
          textAlign: 'center',
          color: '#333'
        }}>
          Admin Login
        </h1>
        
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </p>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="username"
            style={{ 
              display: 'block', 
              color: '#333', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="password"
            style={{ 
              display: 'block', 
              color: '#333', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '12px'
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <button
          type="button"
          onClick={handleTestClick}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Test Button & Check Cookies
        </button>
      </form>
    </div>
  );
} 