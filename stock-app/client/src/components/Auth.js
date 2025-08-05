import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(formData);

      if (isRegister) {
        const res = await axios.post('/api/auth/register', body, config);
        localStorage.setItem('token', res.data.token);
        onLogin();
      } else {
        const res = await axios.post('/api/auth/login', body, config);
        localStorage.setItem('token', res.data.token);
        onLogin();
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark-card">
            <div className="card-header text-center">
              <img src="/logo.png" alt="Logo" className="logo" />
              <h2 className="text-gold">{isRegister ? 'Register' : 'Login'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {isRegister && (
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={onChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <input type="submit" value={isRegister ? 'Register' : 'Login'} className="btn btn-gold" />
                </div>
              </form>
              <p className="mt-3 text-center">
                {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                <span onClick={() => setIsRegister(!isRegister)} className="text-gold" style={{ cursor: 'pointer' }}>
                  {isRegister ? 'Login' : 'Sign Up'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;