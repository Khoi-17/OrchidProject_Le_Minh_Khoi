import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Accordion, Table } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    
    // Chỉ cần kiểm tra token
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      setError('Bạn cần đăng nhập để xem đơn hàng');
      setLoading(false);
      return;
    }
    
    try {
      // Gọi API mà không cần truyền accountId trong URL
      // Backend sẽ lấy thông tin user từ token
      const response = await axios.get(`http://localhost:8080/api/v1/orders/account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };
  
  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };
  
  // Hàm lấy màu badge dựa vào trạng thái đơn hàng
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  // Hàm dịch trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Processing':
        return 'Đang xử lý';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Đang tải thông tin đơn hàng...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={fetchOrders}
          >
            Thử lại
          </button>
        </Alert>
      </Container>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Body className="p-5 text-center">
            <div className="mb-4">
              <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h3 className="mb-3">Bạn chưa có đơn hàng nào</h3>
            <p className="text-muted mb-4">Hãy mua sắm để tạo đơn hàng mới</p>
            <a href="/orchids" className="btn btn-primary px-4 py-2">Mua sắm ngay</a>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Đơn hàng của tôi</h2>
      
      <Accordion defaultActiveKey="0">
        {orders.map((order, index) => (
          <Accordion.Item key={order.orderId} eventKey={index.toString()} className="mb-3 border-0 shadow-sm rounded-3">
            <Accordion.Header>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">Đơn hàng #{order.orderId}</span>
                  <span className="text-muted ms-3">{formatDate(order.orderDate)}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span>{formatCurrency(order.totalAmount)}</span>
                  <Badge bg={getStatusBadge(order.status)} pill>
                    {translateStatus(order.status)}
                  </Badge>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body className="bg-light">
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <h6 className="fw-bold">Thông tin đơn hàng</h6>
                  <p className="mb-1">
                    <span className="text-muted">Khách hàng:</span> {order.customerName}
                  </p>
                  <p className="mb-1">
                    <span className="text-muted">Thời gian:</span> {formatDate(order.orderDate)}
                  </p>
                  <p className="mb-1">
                    <span className="text-muted">Trạng thái:</span> 
                    <Badge bg={getStatusBadge(order.status)} className="ms-2">
                      {translateStatus(order.status)}
                    </Badge>
                  </p>
                </Col>
                <Col md={6} className="text-md-end">
                  <h6 className="fw-bold">Tổng thanh toán</h6>
                  <h4 className="text-primary">{formatCurrency(order.totalAmount)}</h4>
                </Col>
              </Row>
              
              <hr />
              
              <h6 className="fw-bold mb-3">Chi tiết đơn hàng</h6>
              <Table responsive className="border-0">
                <thead className="bg-white">
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th className="text-end">Giá</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetails.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.orchidName}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end fw-semibold">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white">
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Tổng cộng:</td>
                    <td className="text-end fw-bold">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}