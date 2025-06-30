import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Badge, Image, 
  Breadcrumb, Button, Spinner, Alert, Form, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Thay đổi từ react-toastify sang react-hot-toast

export default function DetailOrchid() {
  const [orchid, setOrchid] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  
  // Cập nhật API URL
  const baseUrl = "http://localhost:8080/api/v1/orchids";
  
  useEffect(() => {
    fetchData();
  }, [id]);
  
  const fetchData = () => {
    setLoading(true);
    
    // Lấy token từ localStorage
    const token = localStorage.getItem('jwtToken');
    
    // Cấu hình headers với token nếu có
    const config = {};
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    axios.get(`${baseUrl}/${id}`, config)
      .then(response => {
        setOrchid(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Không thể tải thông tin hoa lan. Vui lòng thử lại sau.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Xử lý khi ảnh lỗi
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SOG7rW5oIOG6o25oIGtow7RuZyBraOG6o2kgZOG7pW5nPC90ZXh0Pjwvc3ZnPg==';
  };

  // Cập nhật hàm xử lý thêm vào giỏ hàng sử dụng react-hot-toast
  const handleAddToCart = () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate('/login');
      return;
    }

    // Tạo đối tượng item để thêm vào giỏ hàng
    const orderItem = {
      orchidId: orchid.id,
      quantity: parseInt(quantity),
      price: orchid.orchidPrice
    };

    // Lấy giỏ hàng hiện tại từ localStorage hoặc tạo mới
    let cart = JSON.parse(localStorage.getItem('cart')) || { orderItems: [] };
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.orderItems.findIndex(item => item.orchidId === orchid.id);
    
    if (existingItemIndex >= 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.orderItems[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      cart.orderItems.push(orderItem);
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiển thị thông báo thành công với react-hot-toast
    toast.success(`Đã thêm ${quantity} ${orchid.orchidName} vào giỏ hàng!`, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      icon: '🛒'
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Đang tải thông tin hoa lan...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2 mt-3">
            <Button variant="outline-danger" onClick={fetchData}>Thử lại</Button>
            <Button variant="outline-primary" as={Link} to="/">Quay lại trang chủ</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Thêm component Toaster để hiển thị thông báo */}
      <Toaster />
      
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item as={Link} to="/home">Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item active>{orchid.orchidName}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-4">
        {/* Hình ảnh */}
        <Col lg={5}>
          <div className="position-relative mb-4">
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
              <div className="position-relative">
                <Image 
                  src={orchid.orchidUrl} 
                  alt={orchid.orchidName} 
                  className="img-fluid" 
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={handleImageError}
                />
                <div className="position-absolute top-0 start-0 p-3">
                  <Badge 
                    bg={orchid.natural ? "success" : "warning"}
                    className="px-3 py-2 fs-6"
                  >
                    {orchid.natural ? 'Tự nhiên' : 'Công nghiệp'}
                  </Badge>
                </div>
              </div>
            </Card>
            <div className="position-absolute top-0 end-0 p-3">
              <Badge 
                bg="primary" 
                className="badge-svg d-flex align-items-center justify-content-center p-2 rounded-circle"
                style={{ width: '50px', height: '50px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M26.924 4c.967 0 1.866.217 2.667.675c.685.39 1.462.93 2.037 1.734l-.012.01l.01.014l2.332 3.022l.822 1.095a9.414 9.414 0 0 1-.002 11.34l-4.508 5.818l6.95 8.944a2 2 0 0 1-.242 2.713l-4.066 3.662A2 2 0 0 1 30 42.775l-5.79-7.383l-5.845 7.451a2 2 0 0 1-2.781.36l-4.379-3.317a2 2 0 0 1-.368-2.826l7.314-9.358l-4.504-5.714l-.006-.008a9.414 9.414 0 0 1-.002-11.339l.002-.002l.811-1.082l2.337-3.029l.108-.141C18.008 4.85 19.853 4 21.678 4zm1.675 2.411c.551.315 1.02.66 1.348 1.088l-.015.011l.1.13a4.03 4.03 0 0 1-.022 4.792c-.934-.57-2.045-.923-3.177-.923h-5.247c-1.123 0-2.267.3-3.241.924a4.2 4.2 0 0 1-.735-2.366c0-.815.256-1.632.773-2.331l.115-.15l.01-.014C19.21 6.59 20.434 6 21.677 6h5.248c.66 0 1.21.145 1.675.411m-9.025 7.616l4.6 5.942l4.6-5.942c-.598-.325-1.278-.518-1.94-.518h-5.248c-.72 0-1.42.179-2.012.518m9.422 12.06l-3.552-4.49l6.066-7.836a5.95 5.95 0 0 0 1.199-2.638l.475.633a7.415 7.415 0 0 1 .003 8.921zm-9.57 3.232l-7.013 8.973l4.378 3.317l6.146-7.836zM16.91 13.852a6.06 6.06 0 0 1-1.192-2.638l-.479.639l-.003.004a7.414 7.414 0 0 0-.005 8.918l9.766 12.39l6.578 8.386l4.066-3.662l-7.42-9.55l-4.795-6.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Badge>
            </div>
          </div>
        </Col>

        {/* Thông tin chi tiết */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-3 h-100">
            <Card.Header className="bg-white border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="fs-3 fw-bold mb-0">{orchid.orchidName}</h1>
                <Badge bg="secondary" className="px-3 py-2">
                  ID: {orchid.id}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="py-4">
              {orchid.orchidDescription && (
                <div className="mb-4">
                  <h5 className="card-title fw-semibold mb-2">Mô tả</h5>
                  <p className="text-muted">{orchid.orchidDescription}</p>
                </div>
              )}
              
              <div className="mb-4">
                <h5 className="card-title fw-semibold mb-2">Thông tin</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td width="30%" className="text-muted">Loại:</td>
                      <td>
                        <Badge 
                          bg={orchid.natural ? "success" : "warning"}
                          text={orchid.natural ? "white" : "dark"}
                          className="px-3 py-2"
                        >
                          {orchid.natural ? 'Hoa lan tự nhiên' : 'Hoa lan công nghiệp'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Danh mục:</td>
                      <td>{orchid.category?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Giá:</td>
                      <td className="fw-bold fs-4 text-primary">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(orchid.orchidPrice)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Thêm phần đặt hàng */}
              <div className="mb-4">
                <h5 className="card-title fw-semibold mb-3">Đặt hàng</h5>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: "120px" }}>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || parseInt(value) <= 0) {
                            setQuantity(1);
                          } else {
                            setQuantity(parseInt(value));
                          }
                        }}
                        style={{ textAlign: 'center' }}
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </InputGroup>
                  </div>
                  <Button 
                    variant="success" 
                    className="d-flex align-items-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus"></i>
                    Thêm vào giỏ hàng
                  </Button>
                </div>
                {quantity > 1 && (
                  <div className="mt-2 text-success">
                    Tổng: {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(orchid.orchidPrice * quantity)}
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center gap-2"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left"></i>
                  Quay lại
                </Button>
            
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}