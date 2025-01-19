package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.UserDto;
import com.fluentooapp.fluentoo.entity.User;
import java.util.List;

public interface UserService {
	User saveUser(UserDto userDto);

	User findUserByEmail(String email);

	List<UserDto> findAllUsers();

	void updateUser(User user);

	User getAuthUser();

	void increaseScore();

	void decreaseScore();

	User authenticateUser(String email, String password);

	boolean existsByEmail(String email);

	void updateDeckStudied(User user);
}
