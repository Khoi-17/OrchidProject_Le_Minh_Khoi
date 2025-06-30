import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Vui lòng nhập tên tài khoản';
    } else if (formData.accountName.length < 3) {
      newErrors.accountName = 'Tên tài khoản phải có ít nhất 3 ký tự';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Log dữ liệu gửi đi để kiểm tra
    console.log("Dữ liệu gửi đi:", formData);
    
    try {
      // Đặt đúng content-type cho request
      const response = await axios.post('http://localhost:8080/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Log response để kiểm tra
      console.log("Response từ server:", response);
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      console.error('Error during registration:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
                <h2 className="mt-2 mb-0" style={{ color: '#764ba2' }}>Đăng ký</h2>
                <p className="text-muted small">Tạo tài khoản mới OrchidHub</p>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên tài khoản</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Nhập tên tài khoản"
                    isInvalid={!!errors.accountName}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accountName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                    isInvalid={!!errors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      isInvalid={!!errors.password}
                      disabled={loading}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('password')}
                      style={{ borderColor: '#ced4da' }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      isInvalid={!!errors.confirmPassword}
                      disabled={loading}
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => togglePasswordVisibility('confirm')}
                      style={{ borderColor: '#ced4da' }}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
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
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Đăng ký
                    </>
                  )}
                </Button>

                <div className="text-center mt-3">
                  <p className="mb-0 text-muted">
                    Đã có tài khoản? 
                    <Link to="/login" className="ms-1 text-decoration-none" style={{ color: '#764ba2' }}>
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}