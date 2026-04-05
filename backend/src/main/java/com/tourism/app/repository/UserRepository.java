package com.tourism.app.repository;

import com.tourism.app.entity.User;
import com.tourism.app.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByRoles_Name(RoleName roleName);
    boolean existsByEmail(String email);
}
