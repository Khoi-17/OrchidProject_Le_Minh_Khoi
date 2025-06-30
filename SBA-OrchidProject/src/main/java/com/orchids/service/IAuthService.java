package com.orchids.service;

import com.orchids.dto.LoginDTO;
import com.orchids.dto.LoginResponseDTO;
import com.orchids.dto.RegisterRequestDTO;

public interface IAuthService {
    public LoginResponseDTO loginUser(LoginDTO loginRequest);
    public void registerUser(RegisterRequestDTO registerRequestDTO);
}
