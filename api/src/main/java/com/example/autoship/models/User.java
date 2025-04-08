package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @Column(nullable = false)
    private Long gitHubID;

    @Setter
    @Column(nullable = false)
    private String fullName;

    private String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    private String imgUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User(Long gitHubID, String full_name, String email,String img_url, Role role) {
        this.gitHubID = gitHubID;
        this.fullName = full_name;
        this.email = email;
        this.imgUrl = img_url;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return "";
    }


    @Override
    public String getUsername() {
        return getFullName();
    }
}
