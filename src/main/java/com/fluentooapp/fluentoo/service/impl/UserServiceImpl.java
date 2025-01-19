package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.dto.UserDto;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import com.fluentooapp.fluentoo.repository.UserRepository;
import com.fluentooapp.fluentoo.service.UserService;
import com.fluentooapp.fluentoo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public User saveUser(UserDto userDto) {
		try {
			// Create and set up the user
			User user = new User();
			user.setFirstName(userDto.getFirstName());
			user.setLastName(userDto.getLastName());
			user.setEmail(userDto.getEmail());
			user.setPassword(passwordEncoder.encode(userDto.getPassword()));

			// Create and set up user stats
			UserStats userStats = UserStats.builder()
					.user(user)
					.studyStreak(0)
					.pointsEarned(0)
					.cardsReviewed(0)
					.decksStudied(0)
					.dailyPointsGoal(1500)
					.lastUpdated(LocalDateTime.now())
					.matchingGamesCompleted(0)
					.matchingGamePoints(0)
					.totalMatchesFound(0)
					.totalMatchingAttempts(0)
					.build();

			// Set up bidirectional relationship
			user.setUserStats(userStats);

			// Save the user which will cascade to userStats
			return userRepository.save(user);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	@Override
	public User findUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
	}

	@Override
	public List<UserDto> findAllUsers() {
		return userRepository.findAll().stream()
				.map(user -> new UserDto(
						user.getId(),
						user.getFirstName(),
						user.getLastName(),
						user.getEmail()))
				.collect(Collectors.toList());
	}

	@Override
	public void updateUser(User user) {
		userRepository.save(user);
	}

	@Override
	public User getAuthUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			String email = ((UserDetails) authentication.getPrincipal()).getUsername();
			return userRepository.findByEmail(email)
					.orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
		}
		return null;
	}

	@Override
	public void increaseScore() {
		User user = getAuthUser();
		if (user != null && user.getUserStats() != null) {
			user.getUserStats().setPointsEarned(
					user.getUserStats().getPointsEarned() + 15);
			userRepository.save(user);
		}
	}

	@Override
	public void decreaseScore() {
		User user = getAuthUser();
		if (user != null && user.getUserStats() != null) {
			user.getUserStats().setPointsEarned(
					user.getUserStats().getPointsEarned() - 5);
			userRepository.save(user);
		}
	}

	@Override
	public User authenticateUser(String email, String password) {
		User user = findUserByEmail(email);
		if (user != null && passwordEncoder.matches(password, user.getPassword())) {
			return user;
		}
		throw new RuntimeException("Invalid email or password");
	}

	@Override
	public boolean existsByEmail(String email) {
		return userRepository.findByEmail(email).isPresent();
	}

	@Override
	public void updateDeckStudied(User user) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'updateDeckStudied'");
	}
}
