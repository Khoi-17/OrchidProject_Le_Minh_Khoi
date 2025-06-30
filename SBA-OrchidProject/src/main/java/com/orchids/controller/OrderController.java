package com.orchids.controller;


import com.orchids.dto.OrderRequestDTO;
import com.orchids.dto.OrderResponseDTO;
import com.orchids.service.IOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        OrderResponseDTO response = orderService.createOrder(orderRequestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getOrdersAll() {
        return ResponseEntity.ok(orderService.getOrdersAll());

    }


    @GetMapping("/account")
    public ResponseEntity<?> getOrdersByAccountId() {
        return ResponseEntity.ok(orderService.getOrdersByAccountId());
    }

}
