import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Vui lòng nhập cả email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password
      });
      
      const { token, role, email: userEmail } = response.data;
      
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userEmail);
      
      if (role === 'ADMIN') {
        navigate('/orchids');
        toast.success(`Chào mừng Admin ${userEmail}!`, {
          icon: '👋',
          duration: 3000
        });
      } else {
        navigate('/home');
        toast.success(`Đăng nhập thành công! Chào mừng ${userEmail}`, {
          duration: 3000
        });
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Email hoặc mật khẩu không đúng.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="py-5">
      <Toaster />
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="bi bi-flower3 display-3" style={{ color: '#764ba2' }}></i>
                <h2 className="mt-2 mb-0" style={{ color: '#764ba2' }}>Đăng nhập</h2>
                <p className="text-muted small">Mua Bán Hoa Lan</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      style={{ borderColor: '#ced4da' }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>
                
                <Button 
                  style={{ backgroundColor: '#764ba2', borderColor: '#764ba2' }}
                  type="submit" 
                  className="w-100 py-2 mb-3" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Đăng nhập
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p className="mb-0 text-muted">
                  Chưa có tài khoản? <Link to="/register" style={{ color: '#764ba2' }}>Đăng ký ngay</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}