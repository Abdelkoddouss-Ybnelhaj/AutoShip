package com.example.autoship.services;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Optional;

import com.example.autoship.models.Role;
import com.example.autoship.models.User;
import com.example.autoship.repositories.UserRepository;
import com.example.autoship.services.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userService = new UserServiceImpl(userRepository);
    }

    @Test
    void loadExistingUserDetails() {
        // case 1 : an existing email
        String userEmail = "abdo@gmail.com";
        User user = new User(147856L,"abdo abdo","abdo@gmail.com","http://url", Role.USER);

        given(userRepository.findUserByEmail(userEmail))
                .willReturn(Optional.of(user));

        UserDetails result = userService.userDetailsService().loadUserByUsername(userEmail);

        assertNotNull(result);
    }

    @Test
    void doNotloadUserDetails() {
        // case 1 : an existing email
        String userEmail = "abdo@gmail.com";

        assertThatThrownBy(() -> userService.userDetailsService().loadUserByUsername(userEmail))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User " + userEmail + " not found !");

    }

}