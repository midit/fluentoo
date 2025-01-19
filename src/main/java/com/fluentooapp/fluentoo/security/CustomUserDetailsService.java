package com.fluentooapp.fluentoo.security;

import com.fluentooapp.fluentoo.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom implementation of the UserDetailsService interface.
 * Responsible for loading user-specific data for authentication.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	/**
	 * Constructor for dependency injection of UserRepository.
	 *
	 * @param userRepository the UserRepository to retrieve user data.
	 */
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Loads the user by their email and builds a UserDetails object.
	 *
	 * @param email the email of the user.
	 * @return UserDetails object for Spring Security.
	 * @throws UsernameNotFoundException if the user is not found.
	 */
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		return userRepository.findByEmail(email)
				.map(user -> org.springframework.security.core.userdetails.User.builder()
						.username(user.getEmail())
						.password(user.getPassword())
						.roles("USER")
						.build())
				.orElseThrow(() -> new UsernameNotFoundException("Invalid username or password."));
	}
}
