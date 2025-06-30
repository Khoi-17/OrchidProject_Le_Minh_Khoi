import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Base64 encoded small placeholder image - no external request needed
const PLACEHOLDER_IMAGE = "https://placehold.co/400x300?text=No+Image";

export default function HomeScreen() {
  const baseUrl = "http://localhost:8080/api/v1/orchids/"; 
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!initialized) {
        setLoading(true);
      }
      
      const token = localStorage.getItem('jwtToken');
      
      const config = {};
      if (token) {
        config.headers = {
          'Authorization': `Bearer ${token}`
        };
      }
      
      const response = await axios.get(baseUrl, config);
      const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setOrchids(sortedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const handleImageError = (e, id) => {
    // Prevent infinite loops of error handling
    if (!failedImages.has(id)) {
      const newFailedImages = new Set(failedImages);
      newFailedImages.add(id);
      setFailedImages(newFailedImages);
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-1">
                    <i className="bi bi-flower1 me-2"></i>
                    Bộ Sưu Tập Hoa Lan
                  </h2>
                  <p className="mb-0 opacity-75">Khám phá các loài hoa lan độc đáo và xinh đẹp</p>
                </Col>
                <Col xs="auto">
                  <div className="d-flex justify-content-center">
                    <div className="input-group" style={{ maxWidth: '400px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Tìm kiếm hoa lan..." 
                        aria-label="Tìm kiếm hoa lan" 
                      />
                      <Button variant="light" size="sm" id="button-addon2">
                        <i className="bi bi-search"></i> Tìm
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content Area */}
      <div style={{ minHeight: '60vh' }}>
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Đang tải dữ liệu...</p>
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="my-4">
            <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={fetchData}>Thử lại</Button>
          </Alert>
        )}

        {!loading && !error && orchids.length > 0 && (
          <Row className="g-4">
            {orchids.map((orchid) => (
              <Col xs={12} sm={6} md={4} lg={3} key={orchid.id}>
                <Card
                  className="h-100 shadow-sm border-0 rounded-3 overflow-hidden"
                  style={{ transition: 'transform 0.3s ease' }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={orchid.orchidUrl}
                      alt={orchid.orchidName}
                      className="img-fluid"
                      style={{ height: '220px', objectFit: 'cover' }}
                      onError={(e) => handleImageError(e, orchid.id)}
                    />
                    <div className="position-absolute top-0 start-0 p-2">
                      <Badge bg={orchid.natural ? 'success' : 'warning'} className="px-3 py-2" style={{ fontSize: '0.85rem' }}>
                        <i className={`bi ${orchid.natural ? 'bi-flower2' : 'bi-gear'} me-1`}></i>
                        {orchid.natural ? 'Tự nhiên' : 'Công nghiệp'}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 fw-bold mb-3">{orchid.orchidName}</Card.Title>
                    {orchid.orchidDescription && (
                      <Card.Text className="text-muted small mb-3">
                        {orchid.orchidDescription.substring(0, 100)}
                        {orchid.orchidDescription.length > 100 ? '...' : ''}
                      </Card.Text>
                    )}
                    <div className="mt-auto d-flex gap-2">
                      <Link
                        to={`/detail/${orchid.id}`}
                        className="text-decoration-none flex-grow-1"
                      >
                        <Button
                          variant="outline-primary"
                          className="w-100 rounded-pill"
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!loading && !error && orchids.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-emoji-frown display-1 text-muted"></i>
            </div>
            <h2>Không tìm thấy dữ liệu</h2>
            <p className="text-muted">Không có hoa lan nào trong bộ sưu tập.</p>
          </div>
        )}
      </div>
    </Container>
  );
}