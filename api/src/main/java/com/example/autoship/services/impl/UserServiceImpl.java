package com.example.autoship.services.impl;

import com.example.autoship.repositories.UserRepository;
import com.example.autoship.services.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {

        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return (UserDetails) userRepository.findUserByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found !"));
            }
        };

    }
}
