import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, FormGroup, Image, Modal, Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { Link } from 'react-router-dom';  // Corrected import

export default function ListOfOrchids() {
    const baseUrl = "http://localhost:8080/api/v1/orchids/";  // Corrected API URL
    const [orchids, setOrchids] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define a placeholder image for failed image loads
    const PLACEHOLDER_IMAGE = "https://placehold.co/400x300?text=No+Image";


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

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
    const fetchData = async () => {
        try {
            setLoading(true);

            // Get JWT token from localStorage
            const token = localStorage.getItem('jwtToken');

            // Configure headers with token if available
            const config = {};
            if (token) {
                config.headers = {
                    'Authorization': `Bearer ${token}`
                };
            }

            const response = await axios.get(baseUrl, config);
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setOrchids(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Failed to load orchid data!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem('jwtToken');

            // Configure headers with token
            const config = {};
            if (token) {
                config.headers = {
                    'Authorization': `Bearer ${token}`
                };
            }
            console.log("Token:", token);

            // Sử dụng API endpoint xóa mới
            await axios.delete(`http://localhost:8080/api/v1/orchids/delete/${id}`, config);
            fetchData();
            toast.success("Xóa hoa lan thành công!");
        } catch (error) {
            console.log(error.message);
            toast.error("Không thể xóa hoa lan!");
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Transform data to match API structure
            const orchidData = {
                orchidName: data.orchidName,
                orchidUrl: data.image,
                orchidDescription: data.description || "",
                orchidPrice: parseFloat(data.price) || 0,
                categoryId: parseInt(data.categoryId) || 1,
                natural: data.natural || false
            };

            // Get JWT token from localStorage
            const token = localStorage.getItem('jwtToken');

            // Configure headers with token and content type
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            // Thay đổi endpoint API từ baseUrl thành http://localhost:8080/api/v1/orchids/create
            await axios.post("http://localhost:8080/api/v1/orchids/create", orchidData, config);
            setShow(false);
            fetchData();
            reset();
            toast.success("Thêm hoa lan thành công!");
        } catch (error) {
            console.log(error.message);
            toast.error("Không thể thêm hoa lan!");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        <i className="bi bi-flower1 me-2"></i>
                                        Quản Lý Hoa Lan
                                    </h2>
                                    <p className="mb-0 opacity-75">Bộ sưu tập các loài hoa lan trong cơ sở dữ liệu</p>
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
                                        Thêm Hoa Lan Mới
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
                                <i className="bi bi-collection" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h4 className="mb-1">{orchids.length}</h4>
                            <small className="text-muted">Tổng Số Hoa Lan</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="text-success mb-2">
                                <i className="bi bi-flower2" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h4 className="mb-1">{orchids.filter(item => item.natural).length}</h4>
                            <small className="text-muted">Hoa Lan Tự Nhiên</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="text-warning mb-2">
                                <i className="bi bi-gear" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <h4 className="mb-1">{orchids.filter(item => !item.natural).length}</h4>
                            <small className="text-muted">Hoa Lan Lai</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Main Table */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0">
                        <i className="bi bi-table me-2 text-primary"></i>
                        Danh Sách Hoa Lan
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải dữ liệu hoa lan...</p>
                        </div>
                    ) : orchids.length === 0 ? (
                        <Alert variant="info" className="m-4 text-center">
                            <i className="bi bi-info-circle me-2"></i>
                            Không có dữ liệu hoa lan. Hãy thêm hoa lan đầu tiên!
                        </Alert>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th className="border-0 py-3 px-4" style={{ width: '120px' }}>
                                        <i className="bi bi-image me-2"></i>Hình ảnh
                                    </th>
                                    <th className="border-0 py-3">
                                        <i className="bi bi-flower1 me-2"></i>Tên Hoa Lan
                                    </th>
                                    <th className="border-0 py-3">
                                        <i className="bi bi-tag me-2"></i>Loại
                                    </th>
                                    <th className="border-0 py-3" style={{ width: '150px' }}>
                                        <i className="bi bi-tag me-2"></i>Nguồn gốc
                                    </th>
                                    <th className="border-0 py-3" style={{ width: '150px' }}>
                                        <i className="bi bi-currency-dollar me-2"></i>Giá
                                    </th>
                                    <th className="border-0 py-3 text-center" style={{ width: '200px' }}>
                                        <i className="bi bi-gear me-2"></i>Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Nội dung hàng giữ nguyên, chỉ thay đổi text */}
                                {orchids.map((orchid) => (
                                    <tr key={orchid.id} className="align-middle">
                                        {/* Ô hình ảnh giữ nguyên */}
                                        <td className="px-4">
                                            <div className="position-relative">
                                                <Image
                                                    src={orchid.orchidUrl}
                                                    width={100}
                                                    height={100}
                                                    rounded
                                                    className="shadow-sm object-fit-cover"
                                                    style={{ border: '2px solid #e9ecef' }}
                                                    onError={(e) => {
                                                        e.target.src = PLACEHOLDER_IMAGE;
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        {/* Các ô khác giữ nguyên */}
                                        <td>
                                            <div>
                                                <h6 className="mb-1 text-dark">{orchid.orchidName}</h6>
                                                <small className="text-muted">{orchid.orchidDescription?.substring(0, 50)}...</small>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg="info" className="px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                                {orchid.category?.name || "Chưa phân loại"}
                                            </Badge>
                                        </td>
                                        <td>
                                            {orchid.natural ? (
                                                <Badge bg="success" className="px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                                    <i className="bi bi-flower2 me-1"></i>
                                                    Tự nhiên
                                                </Badge>
                                            ) : (
                                                <Badge bg="warning" text="dark" className="px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                                    <i className="bi bi-gear me-1"></i>
                                                    Lai tạo
                                                </Badge>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orchid.orchidPrice)}</strong>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Link to={`/edit/${orchid.id}`} className="text-decoration-none">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="rounded-pill px-3"
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        Sửa
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="rounded-pill px-3"
                                                    onClick={() => {
                                                        if (confirm("Bạn có chắc chắn muốn xóa hoa lan này không?")) {
                                                            handleDelete(orchid.id)
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-trash3 me-1"></i>
                                                    Xóa
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
            {/* Add New Orchid Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Thêm Hoa Lan Mới
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">
                                        <i className="bi bi-flower1 me-2 text-primary"></i>
                                        Tên Hoa Lan
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoFocus
                                        className="form-control-lg"
                                        placeholder="Nhập tên hoa lan..."
                                        style={{ borderRadius: '10px' }}
                                        {...register("orchidName", { required: true })}
                                    />
                                    {errors.orchidName && (
                                        <div className="text-danger mt-2">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            Tên hoa lan là bắt buộc
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">
                                        <i className="bi bi-image me-2 text-primary"></i>
                                        Đường dẫn hình ảnh
                                    </Form.Label>
                                    <Form.Control
                                        type="url"
                                        className="form-control-lg"
                                        placeholder="https://example.com/image.jpg"
                                        style={{ borderRadius: '10px' }}
                                        {...register("image", { required: true })}
                                    />
                                    {errors.image && (
                                        <div className="text-danger mt-2">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            URL hình ảnh là bắt buộc
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">
                                        <i className="bi bi-currency-dollar me-2 text-primary"></i>
                                        Giá (VNĐ)
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        className="form-control-lg"
                                        placeholder="Nhập giá..."
                                        style={{ borderRadius: '10px' }}
                                        {...register("price", { required: true, min: 0 })}
                                    />
                                    {errors.price && (
                                        <div className="text-danger mt-2">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            Giá hợp lệ là bắt buộc
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">
                                        <i className="bi bi-diagram-3 me-2 text-primary"></i>
                                        Loại
                                    </Form.Label>
                                    <Form.Select
                                        className="form-control-lg"
                                        style={{ borderRadius: '10px' }}
                                        {...register("categoryId", { required: true })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                                <i className="bi bi-card-text me-2 text-primary"></i>
                                Mô tả
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="form-control-lg"
                                placeholder="Nhập mô tả..."
                                style={{ borderRadius: '10px' }}
                                {...register("description")}
                            />
                        </Form.Group>

                        <FormGroup className="mb-4">
                            <Card className="border-0" style={{ backgroundColor: '#f8f9fa' }}>
                                <Card.Body>
                                    <Form.Check
                                        type="switch"
                                        id="natural-switch"
                                        className="form-switch-lg"
                                        label={
                                            <span className="fw-semibold">
                                                <i className="bi bi-flower2 me-2 text-success"></i>
                                                Hoa Lan Tự Nhiên
                                            </span>
                                        }
                                        {...register("natural")}
                                    />
                                    <small className="text-muted">
                                        Bật nếu đây là hoa lan tự nhiên, tắt nếu là hoa lan lai
                                    </small>
                                </Card.Body>
                            </Card>
                        </FormGroup>

                        <Modal.Footer className="border-0 pt-0">
                            <Button
                                variant="outline-secondary"
                                onClick={handleClose}
                                className="rounded-pill px-4"
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Hủy bỏ
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="rounded-pill px-4 shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        Lưu Hoa Lan
                                    </>
                                )}
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}