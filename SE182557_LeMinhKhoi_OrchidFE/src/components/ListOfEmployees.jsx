import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ListOfEmployees() {
  const [accounts, setAccounts] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setFetchLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8080/api/v1/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAccounts(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tài khoản:', err);
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setFormData({ accountName: '', email: '', password: '', role: 'USER' });
    setErrors({});
  };

  const handleShow = () => setShow(true);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Tên tài khoản không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      
      try {
        // Tạo request data phù hợp với AccountRequestDTO
        const requestData = {
          email: formData.email,
          accountName: formData.accountName,
          password: formData.password,
          // Chuyển đổi role từ string sang int
          role: formData.role === 'ADMIN' ? 1 : 2
        };
        
        const token = localStorage.getItem('jwtToken');
        await axios.post('http://localhost:8080/api/v1/accounts/create', requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        toast.success("Thêm tài khoản thành công!");
        handleClose();
        fetchAccounts(); // Tải lại danh sách sau khi thêm mới
      } catch (error) {
        console.error('Lỗi khi thêm tài khoản:', error);
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi thêm tài khoản");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`http://localhost:8080/api/v1/accounts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        toast.success("Xóa tài khoản thành công!");
        setAccounts(accounts.filter(account => account.id !== id));
      } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        toast.error("Không thể xóa tài khoản. Vui lòng thử lại sau.");
      }
    }
  };

  // Hàm lấy avatar từ tên người dùng
  const getAvatarUrl = (name, email) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d6efd&color=fff&size=100`;
  };

  if (fetchLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchAccounts}>
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-1">
                    <i className="bi bi-people me-2"></i>
                    Quản lý Tài khoản
                  </h2>
                  <p className="mb-0 opacity-75">Quản lý danh sách tài khoản trong hệ thống</p>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="light" 
                    size="lg"
                    onClick={handleShow}
                    className="shadow-sm"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Thêm tài khoản
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-primary mb-2">
                <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{accounts.length}</h4>
              <small className="text-muted">Tổng số tài khoản</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-success mb-2">
                <i className="bi bi-person-badge" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{accounts.filter(item => item.role === 'ADMIN').length}</h4>
              <small className="text-muted">Tài khoản quản trị</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-info mb-2">
                <i className="bi bi-person" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{accounts.filter(item => item.role === 'USER').length}</h4>
              <small className="text-muted">Tài khoản người dùng</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Card */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-people me-2 text-primary"></i>
            Danh sách tài khoản
          </h5>
        </Card.Header>
        <Card.Body className="p-4">
          {accounts.length === 0 ? (
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              Chưa có dữ liệu tài khoản. Thêm tài khoản mới ngay!
            </Alert>
          ) : (
            <Row className="g-4">
              {accounts.map((account) => (
                <Col key={account.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <Card 
                    className="h-100 text-center border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                  >
                    <Card.Body className="p-4">
                      <img
                        src={getAvatarUrl(account.accountName, account.email)}
                        alt={account.accountName}
                        className="rounded-circle mb-3 border border-4 border-primary-subtle"
                        style={{
                          width: '96px',
                          height: '96px',
                          objectFit: 'cover'
                        }}
                      />
                      <h3 className="card-title h5 fw-semibold text-dark mb-3">
                        {account.accountName}
                      </h3>
                      <div className="mb-3">
                        <Badge 
                          bg={account.role === 'ADMIN' ? "danger" : "primary"} 
                          className="px-3 py-2" 
                          style={{ fontSize: '0.85rem' }}
                        >
                          <i className={`bi ${account.role === 'ADMIN' ? 'bi-shield-lock' : 'bi-person'} me-1`}></i>
                          {account.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                        </Badge>
                      </div>
                      <p className="card-text text-muted mb-3 text-truncate">
                        {account.email}
                      </p>
                      <div className="text-muted small fw-medium">
                        ID: {account.id}
                      </div>
                      <div className="mt-3">
                        <Button 
                          as={Link}
                          to={`/editUser/${account.id}`}
                          variant="outline-primary" 
                          size="sm"
                          className="rounded-pill px-3 me-2"
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Sửa
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => handleDelete(account.id)}
                        >
                          <i className="bi bi-trash3 me-1"></i>
                          Xóa
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Add New Account Modal */}
      {show && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h2 className="modal-title text-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm tài khoản mới
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body px-4">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="fw-semibold">
                          <i className="bi bi-person me-2 text-primary"></i>
                          Tên tài khoản
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          className={`form-control form-control-lg ${errors.accountName ? 'is-invalid' : ''}`}
                          placeholder="Nhập tên tài khoản"
                          style={{ borderRadius: '10px' }}
                        />
                        {errors.accountName && (
                          <div className="text-danger mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.accountName}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="fw-semibold">
                          <i className="bi bi-envelope me-2 text-primary"></i>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="example@gmail.com"
                          style={{ borderRadius: '10px' }}
                        />
                        {errors.email && (
                          <div className="text-danger mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <label className="fw-semibold">
                      <i className="bi bi-lock me-2 text-primary"></i>
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Nhập mật khẩu"
                      style={{ borderRadius: '10px' }}
                    />
                    {errors.password && (
                      <div className="text-danger mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <Card className="border-0" style={{ backgroundColor: '#f8f9fa' }}>
                      <Card.Body>
                        <label className="fw-semibold d-block mb-2">
                          <i className="bi bi-shield me-2 text-primary"></i>
                          Vai trò
                        </label>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="roleUser"
                            name="role"
                            value="USER"
                            checked={formData.role === "USER"}
                            onChange={handleInputChange}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="roleUser">
                            Người dùng
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="roleAdmin"
                            name="role"
                            value="ADMIN"
                            checked={formData.role === "ADMIN"}
                            onChange={handleInputChange}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="roleAdmin">
                            Quản trị viên
                          </label>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="modal-footer border-0 pt-0">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleClose}
                      className="rounded-pill px-4"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Hủy
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      className="rounded-pill px-4 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Lưu tài khoản
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}