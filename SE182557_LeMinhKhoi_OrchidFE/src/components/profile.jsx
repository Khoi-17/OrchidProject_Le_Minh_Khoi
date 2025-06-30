import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/v1/accounts/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(response.data);
        setFormData({
          accountName: response.data.accountName || '',
          email: response.data.email || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Khởi tạo formData
  useEffect(() => {
    if (profile) {
      setFormData({
        accountName: profile.accountName || '',
        email: profile.email || '',
        role: profile.role === "ADMIN" ? 1 : 2
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('jwtToken');
      
      // Đảm bảo gửi đúng role ID theo vai trò hiện tại
      const dataToSubmit = {
        ...formData,
        role: profile.role === "ADMIN" ? 1 : 2  // Đảm bảo role ID được gửi đi
      };
      
      await axios.put(`http://localhost:8080/api/v1/accounts/update/${profile.id}`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProfile({
        ...profile,
        accountName: formData.accountName,
        email: formData.email
      });
      
      setUpdateSuccess(true);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // Reset form khi hủy chỉnh sửa
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setUpdateSuccess(false);
    setError(null);
    
    if (isEditing) {
      setFormData({
        accountName: profile.accountName || '',
        email: profile.email || '',
        role: profile.role === "ADMIN" ? 1 : 2
      });
    }
  };

  if (loading && !profile) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Đang tải thông tin...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="mb-4 text-center">
            <h2 className="fw-bold">Thông tin tài khoản</h2>
            <p className="text-muted">Quản lý thông tin cá nhân của bạn</p>
          </div>
          
          <Card className="shadow border-0 overflow-hidden" style={{ borderRadius: '16px' }}>
            <div 
              className="position-relative text-white text-center py-5"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="position-relative mb-4">
                <div 
                  className="mx-auto d-flex align-items-center justify-content-center shadow-lg"
                  style={{
                    width: '130px',
                    height: '130px',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    border: '4px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="bi bi-person-fill" style={{ fontSize: '4rem' }}></i>
                </div>
                
                {profile?.role === 'ADMIN' && (
                  <Badge 
                    bg="danger" 
                    className="position-absolute shadow-sm"
                    style={{ 
                      bottom: '10px', 
                      right: '50%', 
                      transform: 'translateX(55px)',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <i className="bi bi-shield-check me-1"></i> ADMIN
                  </Badge>
                )}
              </div>
              
              <h2 className="mb-1 fw-bold">{profile?.accountName}</h2>
              <p className="mb-0 d-flex align-items-center justify-content-center">
                <i className="bi bi-envelope me-2"></i>
                {profile?.email}
              </p>
              
              <p className="mt-3 mb-0">
                <Badge bg="light" text="dark" className="px-3 py-2" style={{ borderRadius: '20px' }}>
                  ID: #{profile?.id}
                </Badge>
              </p>
            </div>

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
                  <h5 className="mb-3 fw-semibold">Thông tin cá nhân</h5>
                  
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                      <Form.Label className="fw-medium">ID</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profile?.id} 
                        disabled 
                        className="bg-white border"
                        style={{ height: '48px' }}
                      />
                    </Form.Group>
                    
                    <Form.Group as={Col} md={6}>
                      <Form.Label className="fw-medium">Vai trò</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profile?.role} 
                        disabled 
                        className={`bg-white border ${profile?.role === 'ADMIN' ? 'text-danger fw-bold' : ''}`}
                        style={{ height: '48px' }}
                      />
                    </Form.Group>
                  </Row>
                </div>

                <div className={`p-4 rounded-3 mb-4 ${isEditing ? 'bg-white border' : 'bg-light'}`}>
                  <h5 className="mb-3 fw-semibold">Thông tin tài khoản</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Tên tài khoản</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? 'border-primary' : 'bg-white border'}
                      style={{ height: '48px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="fw-medium">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? 'border-primary' : 'bg-white border'}
                      style={{ height: '48px' }}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="light"
                        onClick={toggleEdit}
                        disabled={loading}
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
                    </>
                  ) : (
                    <Button 
                      variant="primary"
                      onClick={toggleEdit}
                      className="px-4 py-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-pencil-fill me-2"></i>
                      Chỉnh sửa thông tin
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;