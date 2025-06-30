import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); 


  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    setUserRole(role || '');
    setUserEmail(email || '');
    
    
    const cartData = JSON.parse(localStorage.getItem('cart')) || { orderItems: [] };
    const itemCount = cartData.orderItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(itemCount);
  }, [location.pathname]); 

  const handleLogout = () => {
 
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    

    setUserRole('');
    setUserEmail('');
    

    navigate('/login');
  };

  return (
    <>
    <Navbar 
      expand="lg" 
      className="shadow-sm"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        height: '70px',
      }}
      variant="dark"
      fixed="top"
    >
      <Container>
        {/* Brand logo và tên */}
        <Navbar.Brand 
          as={Link} 
          to="/home" 
          className="fw-bold d-flex align-items-center"
          style={{ fontSize: '1.5rem' }}
        >
          <div 
            className="me-2 d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)'
            }}
          >
            <i className="bi bi-flower1" style={{ fontSize: '1.2rem', color: '#fff' }}></i>
          </div>
          <span className="text-white">OrchidHub</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{ border: 'none', boxShadow: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            {/* Menu chung cho mọi người dùng - chỉ hiển thị khi KHÔNG phải ADMIN */}
            {userRole !== 'ADMIN' && (
              <>
                <Nav.Link 
                  as={Link}
                  to="/home" 
                  className="fw-semibold px-3 py-2 mx-1 rounded-pill text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Trang chủ
                </Nav.Link>
                
                <Nav.Link 
                  as={Link}
                  to="/home" 
                  className="fw-semibold px-3 py-2 mx-1 rounded-pill text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-collection me-2"></i>
                  Bộ sưu tập
                </Nav.Link>
                
                <Nav.Link 
                  as={Link}
                  to="/gallery" 
                  className="fw-semibold px-3 py-2 mx-1 rounded-pill text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-images me-2"></i>
                  Thư viện ảnh
                </Nav.Link>
              </>
            )}
            
            {/* Các mục quản lý - chỉ hiển thị khi người dùng là ADMIN */}
            {userRole === 'ADMIN' && (
              <>
                <Nav.Link 
                  as={Link}
                  to="/orchids" 
                  className="fw-semibold px-3 py-2 mx-1 rounded-pill text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-flower2 me-2"></i>
                  Quản lý Hoa lan
                </Nav.Link>
                
                <Nav.Link 
                  as={Link}
                  to="/employee" 
                  className="fw-semibold px-3 py-2 mx-1 rounded-pill text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-people me-2"></i>
                  Quản lý Người dùng
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav className="ms-auto d-flex align-items-center">
            {/* Giỏ hàng - chỉ hiển thị khi đã đăng nhập */}
            {userEmail && (
              <Nav.Link 
                as={Link}
                to="/cart" 
                className="px-3 py-2 mx-1 rounded-pill text-white position-relative d-flex align-items-center"
                style={{ 
                  transition: 'all 0.3s ease',
                  height: '40px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-cart3" style={{ fontSize: '1.1rem' }}></i>
                {/* Đã bỏ phần Badge hiển thị số lượng */}
              </Nav.Link>
            )}
            
            {/* Menu người dùng - đã đăng nhập */}
            {userEmail ? (
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                    <span className="text-white fw-semibold d-none d-lg-inline">
                      {userEmail}
                    </span>
                  </div>
                }
                id="user-dropdown"
                className="mx-1"
                align="end"
                style={{
                  '--bs-dropdown-bg': 'rgba(255,255,255,0.95)',
                  '--bs-dropdown-border-color': 'rgba(255,255,255,0.2)',
                  '--bs-dropdown-box-shadow': '0 10px 30px rgba(0,0,0,0.2)',
                  '--bs-dropdown-border-radius': '15px'
                }}
              >
                <NavDropdown.Item 
                  as={Link}
                  to="/profile"
                  className="py-2 px-3"
                >
                  <i className="bi bi-person-circle me-2 text-primary"></i>
                  Hồ sơ cá nhân
                </NavDropdown.Item>
                
                {userRole === 'ADMIN' ? (
                  <NavDropdown.Item 
                    as={Link}
                    to="/order_management"
                    className="py-2 px-3"
                  >
                    <i className="bi bi-clipboard-check me-2 text-success"></i>
                    Quản lý đơn hàng
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item 
                    as={Link}
                    to="/orders"
                    className="py-2 px-3"
                  >
                    <i className="bi bi-bag me-2 text-success"></i>
                    Đơn hàng của tôi
                  </NavDropdown.Item>
                )}
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item 
                  onClick={handleLogout}
                  className="py-2 px-3 text-danger"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link 
                as={Link}
                to="/login" 
                className="px-3 py-2 mx-1 rounded-pill text-white d-flex align-items-center"
                style={{ 
                  transition: 'all 0.3s ease',
                  height: '40px'  // Đảm bảo chiều cao đồng nhất
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <div style={{ paddingTop: '70px' }}></div>
    </>
  );
}

export default NavBar;