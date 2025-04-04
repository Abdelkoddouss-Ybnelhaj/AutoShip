package com.example.autoship.services;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {

    String extractSubject(String token);

    String generateToken(Map<String, Object> extraClaims,Long githubID);

    boolean isTokenValid(String token, String githubID);
}
