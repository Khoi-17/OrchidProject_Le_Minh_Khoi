package com.orchids.service;

import com.orchids.dto.OrderDetailDTO;
import com.orchids.dto.OrderItemDTO;
import com.orchids.dto.OrderRequestDTO;
import com.orchids.dto.OrderResponseDTO;
import com.orchids.pojo.Account;
import com.orchids.pojo.Order;
import com.orchids.pojo.OrderDetail;
import com.orchids.repository.AccountRepository;
import com.orchids.repository.OrChidRepository;
import com.orchids.repository.OrderRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class OrderServiceImpl implements IOrderService {

    private final OrChidRepository orChidRepository;
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;


    public OrderServiceImpl(OrChidRepository orChidRepository, OrderRepository orderRepository, AccountRepository accountRepository) {
        this.orChidRepository = orChidRepository;
        this.orderRepository = orderRepository;
        this.accountRepository = accountRepository;
    }


    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getSubject(); // "sub" = email

        Account account = accountRepository.findByEmail(email);

        Order order = new Order();
        order.setAccount(account);
        order.setOrderDate(new Timestamp(System.currentTimeMillis()));
        order.setOrderStatus("Completed");

        List<OrderDetail> orderDetails = new ArrayList<OrderDetail>();
        double totalPrice = 0.0;

        for(OrderItemDTO itemDTO : orderRequestDTO.getOrderItems()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrchid(orChidRepository.findById(itemDTO.getOrchidId())
                    .orElseThrow(() -> new RuntimeException("Orchid not found with id: " + itemDTO.getOrchidId())));
            orderDetail.setQuantity(itemDTO.getQuantity());
            orderDetail.setPrice(itemDTO.getPrice());
            orderDetail.setOrder(order);
            totalPrice += orderDetail.getPrice() * orderDetail.getQuantity();
            orderDetails.add(orderDetail);
        }

        order.setOrderDetails(orderDetails);
        order.setTotalAmount(totalPrice);
        orderRepository.save(order);
        System.out.println("Successfully created order with ID: " + order.getId());
        return null;
    }

    private OrderResponseDTO convertToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getId());
        dto.setStatus(order.getOrderStatus());
        dto.setCustomerName(order.getAccount().getAccountName());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());

        List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream()
                .map(

                        this::convertDetailToDTO)
                .collect(Collectors.toList());
        dto.setOrderDetails(detailDTOs);

        return dto;
    }


    private OrderDetailDTO convertDetailToDTO(OrderDetail detail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setId(detail.getId());
        dto.setPrice(detail.getPrice());
        dto.setQuantity(detail.getQuantity());

        if (detail.getOrchid() != null) {
            dto.setOrchidId(detail.getOrchid().getId());
            dto.setOrchidName(detail.getOrchid().getOrchidName());
        }

        return dto;
    }


    @Override
    public List<OrderResponseDTO> getOrdersByAccountId() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getSubject(); // "sub" = email

        Account account = accountRepository.findByEmail(email);

        List<Order> orders = orderRepository.findByAccountId(account.getId());
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersAll() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}
