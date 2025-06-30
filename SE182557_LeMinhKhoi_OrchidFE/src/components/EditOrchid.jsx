import React, { useEffect, useState } from 'react';
import {
  Container, Button, Form, Card, Row, Col, Image,
  Breadcrumb, Spinner, Alert
} from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from 'react-router-dom';

// Base64 encoded placeholder image - không cần external request
const PLACEHOLDER_IMAGE = "https://placehold.co/400x300?text=No+Image";


export default function EditOrchid() {
  const baseUrl = "http://localhost:8080/api/v1/orchids";
  const { id } = useParams();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set());

  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue, watch } = useForm();

  // Watch the image field to update preview
  const watchOrchidUrl = watch("orchidUrl");
  const watchNatural = watch("natural");

  // Tải danh sách categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('jwtToken');

        // Cấu hình headers với token nếu có
        const config = {};
        if (token) {
          config.headers = {
            'Authorization': `Bearer ${token}`
          };
        }

        const response = await axios.get("http://localhost:8080/api/v1/orchids/categories", config);
        setCategories(response.data);
      } catch (error) {
        console.error('Không thể tải danh sách loại hoa lan:', error);
        toast.error('Không thể tải danh sách loại hoa lan. Vui lòng thử lại sau.');
      }
    };

    fetchCategories();
  }, []);

  // Tải thông tin hoa lan cần chỉnh sửa
  useEffect(() => {
    setLoading(true);

    // Lấy token từ localStorage
    const token = localStorage.getItem('jwtToken');

    // Thêm token vào header của request
    const config = {};
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }

    axios.get(`${baseUrl}/${id}`, config)
      .then((response) => {
        const orchidData = response.data;
        setOrchid(orchidData);

        // Set form values
        setValue('orchidName', orchidData.orchidName);
        setValue('orchidUrl', orchidData.orchidUrl);
        setValue('natural', orchidData.natural);
        setValue('orchidDescription', orchidData.orchidDescription || '');
        setValue('orchidPrice', orchidData.orchidPrice);
        setValue('categoryId', orchidData.category?.id);

        // Set image preview
        setImagePreview(orchidData.orchidUrl);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        toast.error('Không thể tải thông tin hoa lan');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, setValue]);

  // Update image preview when URL changes
  useEffect(() => {
    if (watchOrchidUrl) {
      setImagePreview(watchOrchidUrl);
    }
  }, [watchOrchidUrl]);

  const handleImageError = (e) => {
    // Prevent infinite loops of error handling
    if (!failedImages.has('preview')) {
      const newFailedImages = new Set(failedImages);
      newFailedImages.add('preview');
      setFailedImages(newFailedImages);
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  const onSubmit = (data) => {
    // Tạo object gửi đến API
    const updateData = {
      orchidName: data.orchidName,
      orchidUrl: data.orchidUrl,
      orchidDescription: data.orchidDescription || "",
      orchidPrice: parseFloat(data.orchidPrice) || 0,
      categoryId: parseInt(data.categoryId) || 1,
      natural: data.natural || false
    };

    // Lấy token từ localStorage
    const token = localStorage.getItem('jwtToken');

    // Thêm token vào header của request
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    toast.promise(
      axios.put(`${baseUrl}/update/${id}`, updateData, config),
      {
        loading: 'Đang cập nhật...',
        success: () => {
          setTimeout(() => navigate('/orchids'), 1500);
          return 'Cập nhật thành công!';
        },
        error: (err) => {
          console.error(err);
          return 'Cập nhật thất bại. Vui lòng thử lại!';
        }
      }
    );
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item active>Chỉnh sửa hoa lan</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-1">
                    <i className="bi bi-pencil-square me-2"></i>
                    Chỉnh sửa thông tin hoa lan
                  </h2>
                  <p className="mb-0 opacity-75">Cập nhật thông tin chi tiết về hoa lan</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-4">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/orchids')}>
            <i className="bi bi-house-door me-2"></i>
            Quay lại danh sách
          </Button>
        </Alert>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white border-bottom">
            <h5 className="mb-0">
              <i className="bi bi-flower1 me-2"></i>
              {orchid.orchidName}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={8}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="orchidName">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-flower1 me-2 text-primary"></i>
                          Tên hoa lan
                        </Form.Label>
                        <Controller
                          name="orchidName"
                          control={control}
                          rules={{ required: "Vui lòng nhập tên hoa lan" }}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="text"
                              isInvalid={!!errors.orchidName}
                              placeholder="Nhập tên hoa lan"
                              style={{ borderRadius: '10px' }}
                            />
                          )}
                        />
                        {errors.orchidName && (
                          <Form.Control.Feedback type="invalid">
                            {errors.orchidName.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="orchidUrl">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-image me-2 text-primary"></i>
                          Đường dẫn hình ảnh
                        </Form.Label>
                        <Controller
                          name="orchidUrl"
                          control={control}
                          rules={{
                            required: "Vui lòng nhập đường dẫn hình ảnh",
                            pattern: {
                              value: /(https?:\/\/[^\s]+)/i,
                              message: "Đường dẫn hình ảnh không hợp lệ"
                            }
                          }}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="text"
                              placeholder="https://example.com/image.jpg"
                              isInvalid={!!errors.orchidUrl}
                              style={{ borderRadius: '10px' }}
                            />
                          )}
                        />
                        {errors.orchidUrl && (
                          <Form.Control.Feedback type="invalid">
                            {errors.orchidUrl.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="orchidPrice">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-currency-dollar me-2 text-primary"></i>
                          Giá (VNĐ)
                        </Form.Label>
                        <Controller
                          name="orchidPrice"
                          control={control}
                          rules={{
                            required: "Vui lòng nhập giá",
                            min: {
                              value: 0,
                              message: "Giá không được nhỏ hơn 0"
                            }
                          }}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="number"
                              placeholder="Nhập giá hoa lan"
                              isInvalid={!!errors.orchidPrice}
                              style={{ borderRadius: '10px' }}
                            />
                          )}
                        />
                        {errors.orchidPrice && (
                          <Form.Control.Feedback type="invalid">
                            {errors.orchidPrice.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="categoryId">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-diagram-3 me-2 text-primary"></i>
                          Loại hoa lan
                        </Form.Label>
                        <Controller
                          name="categoryId"
                          control={control}
                          rules={{ required: "Vui lòng chọn loại hoa lan" }}
                          render={({ field }) => (
                            <Form.Select
                              {...field}
                              isInvalid={!!errors.categoryId}
                              style={{ borderRadius: '10px' }}
                            >
                              <option value="">Chọn loại hoa lan</option>
                              {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        />
                        {errors.categoryId && (
                          <Form.Control.Feedback type="invalid">
                            {errors.categoryId.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="orchidDescription">
                        <Form.Label className="fw-bold">
                          <i className="bi bi-file-text me-2 text-primary"></i>
                          Mô tả
                        </Form.Label>
                        <Controller
                          name="orchidDescription"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Nhập mô tả về loài hoa lan này"
                              {...field}
                              style={{ borderRadius: '10px' }}
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Card className="border-0" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body>
                          <Form.Group controlId="natural">
                            <Form.Check
                              type="switch"
                              label={
                                <span className="fw-semibold">
                                  <i className="bi bi-flower2 me-2 text-success"></i>
                                  Hoa lan tự nhiên
                                </span>
                              }
                              {...register("natural")}
                              className="form-switch-lg"
                            />
                            <Form.Text muted>
                              Chọn nếu đây là loài hoa lan tự nhiên, bỏ chọn nếu đây là hoa lan công nghiệp.
                            </Form.Text>
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill px-4"
                      onClick={() => navigate('/orchids')}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-pill px-4 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      {isSubmitting ? (
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
                          <i className="bi bi-check-lg me-2"></i>
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Col>

              <Col lg={4} className="mt-4 mt-lg-0">
                <div className="text-center">
                  <p className="fw-bold mb-3">Xem trước hình ảnh</p>
                  {imagePreview ? (
                    <div className="position-relative">
                      <Image
                        src={imagePreview}
                        alt={orchid.orchidName}
                        className="img-thumbnail shadow-sm"
                        style={{
                          height: '250px',
                          width: '100%',
                          objectFit: 'cover'
                        }}
                        onError={handleImageError}
                      />
                      <div className="position-absolute top-0 start-0 p-2">
                        <span
                          className={`badge ${watchNatural ? 'bg-success' : 'bg-warning'} px-3 py-2`}
                          style={{ fontSize: '0.85rem' }}
                        >
                          <i className={`bi ${watchNatural ? 'bi-flower2' : 'bi-gear'} me-1`}></i>
                          {watchNatural ? 'Tự nhiên' : 'Công nghiệp'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded p-5 text-center text-muted bg-light">
                      <i className="bi bi-image display-4"></i>
                      <p>Không có hình ảnh</p>
                    </div>
                  )}

                  <Card className="mt-3 shadow-sm">
                    <Card.Header className="bg-light text-start">
                      <h6 className="mb-0">Thông tin cơ bản</h6>
                    </Card.Header>
                    <Card.Body className="text-start">
                      <p className="mb-2">
                        <strong>ID:</strong> {id}
                      </p>
                      <p className="mb-2">
                        <strong>Tên:</strong> {watch('orchidName') || 'Chưa có tên'}
                      </p>
                      <p className="mb-2">
                        <strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(watch('orchidPrice') || 0)}
                      </p>
                      <p className="mb-0">
                        <strong>Loại:</strong> {watchNatural ? 'Tự nhiên' : 'Công nghiệp'}
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}