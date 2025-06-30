//package com.orchids.config;
//
//import com.orchids.service.JWTService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//import org.springframework.web.servlet.HandlerExceptionResolver;
//
//import java.io.IOException;
//
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final HandlerExceptionResolver handlerExceptionResolver;
//
//    private final JWTService jwtService;
//
//    private final UserDetailsService userDetailsService;
//
//    public JwtAuthenticationFilter(HandlerExceptionResolver handlerExceptionResolver, JWTService jwtService, UserDetailsService userDetailsService) {
//        this.handlerExceptionResolver = handlerExceptionResolver;
//        this.jwtService = jwtService;
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
//        String path = request.getRequestURI();
//        return path.startsWith("/api/v1/auth/");
//    }
//
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        final String authorizationHeader = request.getHeader("Authorization");
//        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//        try {
//            final String jwt = authorizationHeader.substring(7);
//            final String username = jwtService.extractUsername(jwt);
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            if (username != null && authentication == null) {
//                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//                if (jwtService.isTokenValid(jwt, userDetails)) {
//                    UsernamePasswordAuthenticationToken authenticationToken =
//                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//
//                    System.out.println(">>> Authorities: " + userDetails.getAuthorities());
//                }
//            }
//            System.out.println(">>> JwtAuthenticationFilter: Checking Authorization header");
//            System.out.println(">>> JWT: " + jwt);
//            System.out.println(">>> Username from token: " + username);
//
//            filterChain.doFilter(request, response); // gọi cuối cùng
//
//        } catch (Exception e) {
//            handlerExceptionResolver.resolveException(request, response, null, e);
//        }
//    }
//}