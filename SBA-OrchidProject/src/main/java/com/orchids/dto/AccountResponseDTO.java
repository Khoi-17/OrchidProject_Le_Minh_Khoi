package com.orchids.dto;

public class AccountResponseDTO {

    private int  id;
    private String email;
    private String role;

    private String accountName;

    public AccountResponseDTO() {
    }

    public AccountResponseDTO(int id, String email, String role,  String accountName) {
        this.id = id;
        this.email = email;
        this.role = role;

        this.accountName = accountName;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
}