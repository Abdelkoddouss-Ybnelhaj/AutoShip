package com.example.autoship.services;

import com.example.autoship.models.Role;
import com.example.autoship.models.User;
import com.example.autoship.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final String clientUrl;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2LoginSuccessHandler(OAuth2AuthorizedClientService authorizedClientService,
                                    @Value("${spring.security.oauth2.client-url:http://localhost:3000}") String clientUrl,
                                     UserRepository userRepository,
                                     JwtService jwtService) {
        this.authorizedClientService = authorizedClientService;
        this.clientUrl = clientUrl;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();
        String username = oauthUser.getAttribute("name");
        Long githubID = ((Number) Objects.requireNonNull(oauthUser.getAttribute("id"))).longValue();


        if (username == null) {
            log.error("OAuth2 authentication failed: Missing required attributes (githubID={})", githubID);
            response.sendRedirect(clientUrl+"/login?success=false");
            return;
        }

        try {

            log.info("OAuth2 authentication attempt for user: {}", username);
            // Retrieve OAuth2 client for GitHub
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(),
                    oauthToken.getName()
            );

            // Extract access token
            String accessToken = authorizedClient.getAccessToken().getTokenValue();

            if (accessToken == null || accessToken.isEmpty()){
                throw new Exception("Error Retrieving access token for user " + username);
            }

            log.info("Access-Token successfully Retrieved for user : {}",username);

            String email = oauthUser.getAttribute("email");
            String avatar_url = oauthUser.getAttribute("avatar_url");

            // create user if new
            Optional<User> user = userRepository.findById(githubID);
            if(user.isEmpty()){
                log.info("Saving {} as a new user the database",username);
                User newUser = new User(githubID,username,email,avatar_url, Role.USER);
                user = Optional.of(userRepository.save(newUser));
            }

            String jwtToken = generateToken(accessToken,githubID,user.get());

            log.info("JWT successfully generated for user: {}", username);

            // Set JWT token in response header
            response.setHeader("Authorization", "Bearer " + jwtToken);

            // Redirect user to client app
            response.sendRedirect(clientUrl+"/login?success=true&token="+jwtToken);
            log.info("Redirecting user {} to client app with authentication token.", email);
        } catch (Exception ex){
            response.sendRedirect(clientUrl+"/login?success=false");
        }

    }


    private String generateToken(String accessToken,Long githubID, User user){
        // Create JWT token with the access token
        Map<String, Object> claims = new HashMap<>();
        claims.put("access-token",accessToken);
        claims.put("role",user.getRole());
        claims.put("username",user.getUsername());

        return jwtService.generateToken(claims,githubID);
    }
}