package com.example.autoship.repositories;

import com.example.autoship.models.Role;
import com.example.autoship.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository underTest;

    @BeforeEach
    void setup(){
        User user = new User(147856L,"abdo abdo","abdo@gmail.com","http://url", Role.USER);
        underTest.save(user);
    }


    @Test
    void checkIfEmailExist(){
        // case 1 : existed email
        String email = "abdo@gmail.com";
        Boolean result = underTest.existsByEmail(email);

        assertThat(result).isTrue();

        // case 2 : inexisted email
        email = "abduh@gmail.com";
        result = underTest.existsByEmail(email);

        assertThat(result).isFalse();
    }

    @Test
    void getUserInfoByEmail() {

        String email = "abdo@gmail.com";
        Optional<User> user = underTest.findUserByEmail(email);

        // email is unique, so I don't need to add more checks
        assertThat(user).isPresent();
    }

}
