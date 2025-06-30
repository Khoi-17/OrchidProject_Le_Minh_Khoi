//package com.orchids.service;
//
//import com.orchids.pojo.Account;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Base64;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//
//@Service
//public class JWTService {
//
//    @Value("${security.jwt.secret-key}")
//    private String secretKey;
//
//    @Value("${security.jwt.expiration-time}")
//    private long jwtExpiration;
//
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//
//    public String generateToken(UserDetails userDetails) {
//        Map<String, Object> claims = new HashMap<>();
//
//
//        if (userDetails instanceof Account account && account.getRole() != null) {
//            claims.put("role", account.getRole().getRoleName());
//        }
//
//        return generateToken(claims, userDetails);
//    }
//
//    public String generateToken(Map<String, Object> extractClaims, UserDetails userDetails) {
//        return buildToken(extractClaims, userDetails, jwtExpiration);
//    }
//
//    private String buildToken(Map<String, Object> extractClaims, UserDetails userDetails, long expiration) {
//        return Jwts.builder()
//                .setClaims(extractClaims)
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(SignatureAlgorithm.HS256, getSignKey())
//                .compact();
//    }
//
//    public Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSignKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    private Key getSignKey() {
//        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//
//    public boolean isTokenValid(String jwt, UserDetails userDetails) {
//        final String username = extractUsername(jwt);
//        return username.equals(userDetails.getUsername()) && !isTokenExpired(jwt);
//    }
//
//    private boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    public long getJwtExpiration() {
//        return jwtExpiration;
//    }
//
//    public long getExpirationTime() {
//        return jwtExpiration / 1000;
//    }
//}
