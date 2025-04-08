package com.example.autoship.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class DeploymentConfigDTO {

    @NotBlank(message = "Repository name is required")
    private String repo_name;

    @NotBlank(message = "Branch name is required")
    private String branch;

    @NotEmpty(message = "At least one event must be specified")
    private List<@NotBlank(message = "Event must not be blank") String> events;

    @NotBlank(message = "Server IP is required")
    @Pattern(
            regexp = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4}$",
            message = "Invalid IP address format"
    )
    private String serverIP;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Private key is required")
    private String sshKey;

    @NotBlank(message = "Docker username is required")
    private String docker_username;

    @NotBlank(message = "Docker password is required")
    private String docker_password;

}
