package com.orchids.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.orchids.dto.LoginDTO;
import com.orchids.dto.LoginResponseDTO;
import com.orchids.dto.RegisterRequestDTO;
import com.orchids.pojo.Account;
import com.orchids.pojo.Role;
import com.orchids.repository.AccountRepository;
import com.orchids.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AuthService implements IAuthService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.jwt.signer-key}")
    private String SIGNER_KEY;

    @Autowired
    public AuthService(AccountRepository accountRepository, RoleRepository roleRepository) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
    }


    public LoginResponseDTO loginUser(LoginDTO loginRequest) {

        Account account = accountRepository.findByEmail(loginRequest.getEmail());
        if(account == null) {
            throw new IllegalArgumentException("Email not found");
        }

       boolean isPasswordValid = passwordEncoder.matches(loginRequest.getPassword(), account.getPassword());
//        boolean isPasswordValid = loginRequest.getPassword().equals(account.getPassword());

        if(!isPasswordValid) {
            throw new IllegalArgumentException("Invalid password");
        }
        String token = generateToken(account);
        return new LoginResponseDTO(account.getEmail(), account.getRole().getRoleName(), token);
    }

    @Transactional
    public void registerUser(RegisterRequestDTO registerRequestDTO) {


        Account existingAccount = accountRepository.findByEmail(registerRequestDTO.getEmail());
        if (existingAccount != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Role role = roleRepository.findByRoleName("USER");
        Account newAccount = new Account();
        newAccount.setAccountName(registerRequestDTO.getAccountName());
        newAccount.setEmail(registerRequestDTO.getEmail());
        newAccount.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        newAccount.setRole(role);


        accountRepository.save(newAccount);

    }

    public String generateToken(Account account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getEmail())
                .issuer("sba.project.tuvanluatgiaothong")
                .issueTime(new Timestamp(System.currentTimeMillis()))
                .expirationTime(new Timestamp(System.currentTimeMillis() + 3600000)) // 1 hour expiration
                .claim("scope",account.getRole().getRoleName().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot generate token for email: {}", account.getEmail(), e);
            throw new RuntimeException(e);
        }
    }

}
