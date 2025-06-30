package com.orchids.dto;

public class RegisterRequestDTO {


        private String accountName;
        private String email;
        private String password;
        private String confirmPassword;


    public RegisterRequestDTO() {
    }

    public RegisterRequestDTO(String accountName, String email, String password, String confirmPassword) {
        this.accountName = accountName;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;

    }
    public String getConfirmPassword() {
        return confirmPassword;
    }
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
