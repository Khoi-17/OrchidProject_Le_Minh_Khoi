package com.orchids.controller;


import com.orchids.dto.LoginDTO;
import com.orchids.dto.LoginResponseDTO;
import com.orchids.dto.RegisterRequestDTO;
import com.orchids.pojo.Account;
import com.orchids.service.AuthService;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthService authService;

    public AuthenticationController(  AuthService authService) {
        this.authService = authService;
    }


//    @PostMapping("/signup")
//    public ResponseEntity<?> register(@RequestBody RegisterUserDTO registerUserDTO) {
//        return ResponseEntity.ok(authenticationService.signUp(registerUserDTO));
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@Valid @RequestBody LoginDTO loginDTO) {
        LoginResponseDTO result =  authService.loginUser(loginDTO) ;
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        authService.registerUser(registerRequest);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

//    @GetMapping
//    public ResponseEntity<List<Account>> allUsers() {
//        List<Account> users = authenticationService.getAllUsers();
//
//        return ResponseEntity.ok(users);
//    }
}

