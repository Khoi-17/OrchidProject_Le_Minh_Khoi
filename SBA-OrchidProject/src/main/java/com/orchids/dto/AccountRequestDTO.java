package com.orchids.dto;

import com.orchids.pojo.Role;

public class AccountRequestDTO {

    private String email;
    private int role;
    private String password;
    private String accountName;

    public AccountRequestDTO() {
    }

    public AccountRequestDTO(String email, int role, String password, String accountName) {
        this.email = email;
        this.role = role;
        this.password = password;
        this.accountName = accountName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
}
