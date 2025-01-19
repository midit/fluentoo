package com.fluentooapp.fluentoo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Main entry point for the Superflash application.
 * This class initializes and runs the Spring Boot application.
 */
@SpringBootApplication
@EnableConfigurationProperties
public class FluentooApplication {

	/**
	 * The main method that launches the application.
	 *
	 * @param args command-line arguments.
	 */
	public static void main(String[] args) {
		SpringApplication.run(FluentooApplication.class, args);
	}
}
