package com.example.autoship.services.impl;

import com.example.autoship.repositories.UserRepository;
import com.example.autoship.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {

        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String subject) {
                return (UserDetails) userRepository.findById(Long.parseLong(subject))
                        .orElseThrow(() -> new UsernameNotFoundException("ID " + subject + " not found !"));
            }
        };

    }
}
