package com.javaweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
		exclude = org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
)
public class ProjectSwp391Group4Application {

	public static void main(String[] args) {
		SpringApplication.run(ProjectSwp391Group4Application.class, args);
	}

}
