package com.orchids.service;

import com.orchids.dto.AccountRequestDTO;
import com.orchids.dto.AccountResponseDTO;
import com.orchids.pojo.Account;
import com.orchids.pojo.Role;
import com.orchids.repository.AccountRepository;
import com.orchids.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AccountServiceImpl implements IAccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    public AccountServiceImpl(AccountRepository accountRepository, RoleRepository roleRepository) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String authenticateUser() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String role = account.getRole().getRoleName();
        return role;
    }
    private AccountResponseDTO convertToResponseDTO(Account account) {
        // Conversion logic from AccountRequestDTO to AccountResponseDTO
        AccountResponseDTO responseDTO = new AccountResponseDTO();
        responseDTO.setId(account.getId());
        responseDTO.setEmail(account.getEmail());
        responseDTO.setAccountName(account.getAccountName());
        responseDTO.setRole(account.getRole().getRoleName());
        return responseDTO;
    }

    @Override
    public List<AccountResponseDTO> getAccounts() {
        List<AccountResponseDTO> accountResponseDTOList = new ArrayList<>();
        accountRepository.findAll().forEach(account -> {
            AccountResponseDTO responseDTO = convertToResponseDTO(account);
            accountResponseDTOList.add(responseDTO);
        });
        return accountResponseDTOList;
    }

    @Override
    public AccountResponseDTO getAccountById(int id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
        AccountResponseDTO responseDTO = convertToResponseDTO(account);
        return responseDTO;
    }



    @Override
    public AccountResponseDTO saveAccount(AccountRequestDTO accountRequestDTO) {
        Role role = roleRepository.findById(accountRequestDTO.getRole())
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        Account account = new Account();
        account.setAccountName(accountRequestDTO.getAccountName());
        account.setEmail(accountRequestDTO.getEmail());
        account.setPassword(passwordEncoder.encode(accountRequestDTO.getPassword()));
        account.setRole(role);
        account = accountRepository.save(account);
        AccountResponseDTO responseDTO = convertToResponseDTO(account);
        return responseDTO;
    }

    @Override
    public AccountResponseDTO updateAccount(int id, AccountRequestDTO accountRequestDTO) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));

        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getSubject(); // "sub" = email

        Account currentRole = accountRepository.findByEmail(email);

        if (!"ADMIN".equals(currentRole.getRole().getRoleName())) {
            // Người không phải ADMIN không được đổi role
            account.setAccountName(accountRequestDTO.getAccountName());
            account.setEmail(accountRequestDTO.getEmail());
            account.setPassword(passwordEncoder.encode(accountRequestDTO.getPassword()));
            // KHÔNG cập nhật role
        } else {
            Role role = roleRepository.findById(accountRequestDTO.getRole())
                    .orElseThrow(() -> new EntityNotFoundException("Role not found"));
            account.setAccountName(accountRequestDTO.getAccountName());
            account.setEmail(accountRequestDTO.getEmail());
            account.setPassword(passwordEncoder.encode(accountRequestDTO.getPassword()));
            account.setRole(role);
        }

        account = accountRepository.save(account);
        return convertToResponseDTO(account);
    }


    @Override
    public void deleteAccount(int id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));

        String currentRole = authenticateUser();
        if (!"ADMIN".equals(currentRole)) {
            throw new AccessDeniedException("You do not have permission to delete this account");
        }

        accountRepository.delete(account);

    }

    @Override
    public AccountResponseDTO getAccountMe() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getSubject(); // "sub" = email

        Account account = accountRepository.findByEmail(email);
        AccountResponseDTO responseDTO = convertToResponseDTO(account);
        return responseDTO;
    }
}
