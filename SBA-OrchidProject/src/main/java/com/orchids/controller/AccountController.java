package com.orchids.controller;


import com.orchids.dto.AccountRequestDTO;
import com.orchids.service.IAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final IAccountService accountService;
    public AccountController(IAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAccounts());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> getAccountById(@PathVariable int id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> saveAccount(@RequestBody AccountRequestDTO accountRequestDTO) {
        return ResponseEntity.ok(accountService.saveAccount(accountRequestDTO));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> updateAccount(@PathVariable int id,@RequestBody AccountRequestDTO accountRequestDTO) {
        return ResponseEntity.ok(accountService.updateAccount(id, accountRequestDTO));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> deleteAccount(@PathVariable int id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAccounts() {
        return ResponseEntity.ok(accountService.getAccountMe());
    }



}
