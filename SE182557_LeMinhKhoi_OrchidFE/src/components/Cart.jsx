import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Table, Button, 
  Image, Form, InputGroup, Spinner, Alert
} from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Cart() {
  const [cart, setCart] = useState({ orderItems: [] });
  const [orchids, setOrchids] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const baseUrl = "http://localhost:8080/api/v1/orchids";
  const orderApiUrl = "http://localhost:8080/api/v1/orders"; 

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || { orderItems: [] };
    setCart(cartData);
    
    if (cartData.orderItems.length === 0) {
      setLoading(false);
      return;
    }

    const orchidIds = cartData.orderItems.map(item => item.orchidId);
    fetchOrchids(orchidIds);
  }, []);

  const fetchOrchids = async (orchidIds) => {
    setLoading(true);
    
    const token = localStorage.getItem('jwtToken');
    
    const config = {};
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const orchidData = {};
      
      await Promise.all(orchidIds.map(async (id) => {
        try {
          const response = await axios.get(`${baseUrl}/${id}`, config);
          orchidData[id] = response.data;
        } catch (err) {
          console.error(`Error fetching orchid ${id}:`, err);
        }
      }));
      
      setOrchids(orchidData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orchid data:', err);
      setError('Không thể tải thông tin hoa lan. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (orchidId, newQuantity) => {
    newQuantity = Math.max(1, newQuantity);
    
    const updatedCart = { ...cart };
    
    const itemIndex = updatedCart.orderItems.findIndex(item => item.orchidId === orchidId);
    if (itemIndex !== -1) {
      updatedCart.orderItems[itemIndex].quantity = newQuantity;
      
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      toast.success('Đã cập nhật số lượng!', {
        duration: 2000,
        position: 'bottom-center',
        style: { background: '#10B981', color: '#fff' }
      });
    }
  };

  const removeItem = (orchidId) => {
    const updatedCart = { ...cart };
    
    updatedCart.orderItems = updatedCart.orderItems.filter(item => item.orchidId !== orchidId);
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng!', {
      duration: 2000,
      position: 'bottom-center',
      style: { background: '#F87171', color: '#fff' }
    });
  };

  const clearCart = () => {
    const emptyCart = { orderItems: [] };
    setCart(emptyCart);
    localStorage.setItem('cart', JSON.stringify(emptyCart));
    
    toast.success('Đã xóa toàn bộ giỏ hàng!', {
      duration: 2000,
      position: 'bottom-center',
      style: { background: '#F87171', color: '#fff' }
    });
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SOG7rW5oIOG6o25oIGtow7RuZyBraOG6o2kgZOG7pW5nPC90ZXh0Pjwvc3ZnPg==';
  };

  const calculateTotal = () => {
    return cart.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }

    const loadingToast = toast.loading('Đang xử lý đơn hàng...');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(orderApiUrl, cart, config);
      
      toast.dismiss(loadingToast);
      toast.success('Đặt hàng thành công!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        icon: '🎉'
      });
      
      localStorage.setItem('cart', JSON.stringify({ orderItems: [] }));
      setCart({ orderItems: [] });
      
      navigate('/orders');
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error creating order:', error);
      
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', {
        duration: 4000,
        position: 'bottom-center',
        style: { background: '#EF4444', color: '#fff' }
      });
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Đang tải thông tin giỏ hàng...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  if (cart.orderItems.length === 0) {
    return (
      <Container className="py-5">
        <Toaster />
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </div>
                <h3 className="mb-3">Giỏ hàng trống</h3>
                <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <Button 
                  variant="primary" 
                  as={Link} 
                  to="/orchids"
                  className="px-4 py-2"
                >
                  Tiếp tục mua sắm
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Toaster />
      <h2 className="mb-4">Giỏ hàng của tôi</h2>
      
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-semibold">Sản phẩm ({cart.orderItems.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive borderless className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '100px' }}></th>
                    <th>Sản phẩm</th>
                    <th style={{ width: '150px' }}>Giá</th>
                    <th style={{ width: '150px' }}>Số lượng</th>
                    <th style={{ width: '150px' }}>Tổng</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.orderItems.map((item) => {
                    const orchid = orchids[item.orchidId];
                    return (
                      <tr key={item.orchidId}>
                        <td className="text-center">
                          <Image 
                            src={orchid?.orchidUrl} 
                            alt={orchid?.orchidName} 
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                            className="rounded"
                            onError={handleImageError}
                          />
                        </td>
                        <td>
                          <div>
                            <Link to={`/details/${item.orchidId}`} className="text-decoration-none">
                              <h6 className="mb-1">{orchid?.orchidName || 'Sản phẩm không có sẵn'}</h6>
                            </Link>
                            {orchid?.category && (
                              <small className="text-muted d-block">{orchid.category.name}</small>
                            )}
                          </div>
                        </td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>
                          <InputGroup size="sm" style={{ width: '120px' }}>
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => updateQuantity(item.orchidId, item.quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <Form.Control
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.orchidId, parseInt(e.target.value) || 1)}
                              style={{ textAlign: 'center' }}
                            />
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => updateQuantity(item.orchidId, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </InputGroup>
                        </td>
                        <td className="fw-semibold">{formatCurrency(item.price * item.quantity)}</td>
                        <td>
                          <Button 
                            variant="link" 
                            className="text-danger p-0"
                            onClick={() => removeItem(item.orchidId)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="bg-white py-3 border-top">
              <div className="d-flex justify-content-between">
                <Button 
                  variant="outline-secondary" 
                  as={Link} 
                  to="/orchids"
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-arrow-left"></i>
                  Tiếp tục mua sắm
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={clearCart}
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-x-circle"></i>
                  Xóa giỏ hàng
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-semibold">Tóm tắt đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Tổng cộng</strong>
                <strong className="text-primary fs-4">{formatCurrency(calculateTotal())}</strong>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCheckout}
              >
                <i className="bi bi-credit-card"></i>
                Thanh toán
              </Button>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm rounded-3 mt-3">
            <Card.Body>
              <h6 className="mb-3 fw-semibold">Mã giảm giá</h6>
              <InputGroup>
                <Form.Control
                  placeholder="Nhập mã giảm giá"
                />
                <Button variant="outline-primary">
                  Áp dụng
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}