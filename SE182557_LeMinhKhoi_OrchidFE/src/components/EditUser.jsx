import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    role: '',
    password: ''
  });
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/accounts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
        setFormData({
          accountName: response.data.accountName || '',
          email: response.data.email || '',
          role: response.data.role === "ADMIN" ? 1 : 2,
          password: '' // Empty password field for security
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: parseInt(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('jwtToken');
      
      // If password is empty, don't include it in the update
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password.trim()) {
        delete dataToSubmit.password;
      }
      
      await axios.put(`http://localhost:8080/api/v1/accounts/update/${id}`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUpdateSuccess(true);
      // Refetch user data to get updated information
      const response = await axios.get(`http://localhost:8080/api/v1/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Đang tải thông tin người dùng...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Chỉnh sửa người dùng</h2>
              <p className="text-muted">ID: {id}</p>
            </div>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="px-3 py-2"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Quay lại
            </Button>
          </div>
          
          <Card className="shadow border-0 overflow-hidden" style={{ borderRadius: '16px' }}>
            <Card.Header 
              className="text-white py-4"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="d-flex align-items-center">
                <div 
                  className="me-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                  }}
                >
                  <i className="bi bi-person-fill" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">{user?.accountName || 'Người dùng'}</h4>
                  <p className="mb-0 text-white-50">{user?.email}</p>
                </div>
                {user?.role === 'ADMIN' && (
                  <span 
                    className="ms-auto badge bg-danger px-3 py-2"
                    style={{ borderRadius: '20px' }}
                  >
                    <i className="bi bi-shield-check me-1"></i> ADMIN
                  </span>
                )}
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              
              {updateSuccess && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Cập nhật thông tin thành công!
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="mt-2">
                <div className="bg-light p-4 rounded-3 mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Tên tài khoản</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      className="border"
                      style={{ height: '48px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border"
                      style={{ height: '48px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Vai trò</Form.Label>
                    <Form.Select 
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      className="border"
                      style={{ height: '48px' }}
                      required
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Mật khẩu</Form.Label>
                    <Form.Text className="text-muted d-block mb-2">
                      Để trống nếu không muốn thay đổi mật khẩu
                    </Form.Text>
                    <Form.Control 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border"
                      style={{ height: '48px' }}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="light"
                    onClick={() => navigate(-1)}
                    className="me-2 px-4 py-2"
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="bi bi-x me-2"></i>
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="px-4 py-2"
                    style={{ borderRadius: '8px' }}
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
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2 me-2"></i>
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUser;