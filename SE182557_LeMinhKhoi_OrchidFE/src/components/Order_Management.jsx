import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Accordion, Table, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Order_Management() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      setError('Bạn cần đăng nhập để quản lý đơn hàng');
      setLoading(false);
      return;
    }
    
    try {
      // Admin API endpoint to get all orders
      const response = await axios.get(`http://localhost:8080/api/v1/orders/all`, {
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
  
  const updateOrderStatus = async () => {
    if (!currentOrder) return;
    
    setStatusUpdateLoading(true);
    const token = localStorage.getItem('jwtToken');
    
    try {
      await axios.put(`http://localhost:8080/api/v1/orders/${currentOrder.orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the order in the local state
      const updatedOrders = orders.map(order => {
        if (order.orderId === currentOrder.orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.');
    } finally {
      setStatusUpdateLoading(false);
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

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
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
              <i className="bi bi-clipboard-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h3 className="mb-3">Không có đơn hàng nào trong hệ thống</h3>
            <p className="text-muted mb-4">Đơn hàng mới sẽ hiển thị ở đây</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý đơn hàng</h2>
        
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center">
            <span className="me-2">Lọc theo:</span>
            <Form.Select 
              size="sm" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="All">Tất cả đơn hàng</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </Form.Select>
          </div>
          
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={fetchOrders}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Row className="g-3">
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-clipboard-data text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Tổng đơn hàng</h6>
                  <h4 className="mb-0">{orders.length}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i className="bi bi-clock text-warning" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Chờ xử lý</h6>
                  <h4 className="mb-0">{orders.filter(o => o.status === 'Pending').length}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Hoàn thành</h6>
                  <h4 className="mb-0">{orders.filter(o => o.status === 'Completed').length}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                  <i className="bi bi-x-circle text-danger" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Đã hủy</h6>
                  <h4 className="mb-0">{orders.filter(o => o.status === 'Cancelled').length}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Accordion defaultActiveKey="0">
        {filteredOrders.map((order, index) => (
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
                    <span className="text-muted">Email:</span> {order.customerEmail || 'N/A'}
                  </p>
                  <p className="mb-1">
                    <span className="text-muted">Thời gian:</span> {formatDate(order.orderDate)}
                  </p>
                  <p className="mb-1 d-flex align-items-center">
                    <span className="text-muted me-2">Trạng thái:</span> 
                    <Badge bg={getStatusBadge(order.status)} className="me-2">
                      {translateStatus(order.status)}
                    </Badge>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        setCurrentOrder(order);
                        setNewStatus(order.status);
                        setShowStatusModal(true);
                      }}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Cập nhật
                    </Button>
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

      {/* Modal for updating order status */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Đơn hàng #{currentOrder?.orderId}</p>
          <Form.Group>
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Chờ xử lý</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={updateOrderStatus}
            disabled={statusUpdateLoading}
          >
            {statusUpdateLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang cập nhật...
              </>
            ) : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}