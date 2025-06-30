package com.orchids.service;

import com.orchids.dto.AccountRequestDTO;
import com.orchids.dto.AccountResponseDTO;

import java.util.List;

public interface IAccountService {

    public List<AccountResponseDTO> getAccounts();
    public AccountResponseDTO getAccountById(int id);
    public AccountResponseDTO saveAccount(AccountRequestDTO accountRequestDTO);
    public AccountResponseDTO updateAccount(int id, AccountRequestDTO accountRequestDTO);
    public void deleteAccount(int id);
    public AccountResponseDTO getAccountMe();
}
