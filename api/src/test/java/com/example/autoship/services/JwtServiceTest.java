package com.example.autoship.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.autoship.models.Role;
import com.example.autoship.models.User;
import com.example.autoship.services.impl.JwtServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.Map;


@ExtendWith(MockitoExtension.class)
public class JwtServiceTest {

    private JwtService jwtService;
    Map<String, Object> claims;
    UserDetails userDetails;

    @BeforeEach
    void setup() {
        jwtService = new JwtServiceImpl();
        userDetails = new User(147856L,"abdo abdo","abdo@gmail.com","http://url", Role.USER);;
        claims = new HashMap<>();
        claims.put("access-token","access-token");
        claims.put("role",Role.USER);
        claims.put("username","username");
    }

    @Test
    void CheckTokenGeneration() {

        String jwt = jwtService.generateToken(claims,14785L);

        assertNotNull(jwt);
    }

    @Test
    public void testExtractUserName_Success() {

        // Generate token
        String jwt = jwtService.generateToken(claims,14785L);

        // extract username
        String subject = jwtService.extractSubject(jwt);

        // Assert
        assertEquals("14785", subject);
    }

    @Test
    public void testIsTokenValid_ValidToken() {
        // Generate token
        String jwt = jwtService.generateToken(claims,14785L);

        boolean isValid = jwtService.isTokenValid(jwt, "14785");

        assertThat(isValid).isTrue();
    }

    @Test
    public void testIsTokenValid_InValidToken() {
        // generate the token with the first variable
        String jwt = jwtService.generateToken(claims,14785L);

        // testing with the second variable
        boolean isValid = jwtService.isTokenValid(jwt, "14786");

        assertThat(isValid).isFalse();

    }
}