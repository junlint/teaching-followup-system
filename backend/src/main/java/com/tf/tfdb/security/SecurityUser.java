package com.tf.tfdb.security;

import com.tf.tfdb.entity.User;
import com.tf.tfdb.model.UserStatus;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class SecurityUser implements UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String role; // ROLE_ADMIN / ROLE_TEACHER
    private final UserStatus status;
    private final String realName;

    public SecurityUser(User u) {
        this.id = u.getId();
        this.username = u.getPhoneNumber();
        this.password = u.getPassword();
        this.role = u.getRole().asSpringRole();
        this.status = u.getStatus();
        this.realName = u.getRealName();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.disabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status != UserStatus.disabled;
    }
}
