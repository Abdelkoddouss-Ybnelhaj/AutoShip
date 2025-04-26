package com.example.autoship.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NonNull;

import java.util.List;

@Data
public class DeploymentConfigDTO {

    @NotBlank(message = "Repository name is required")
    @NonNull
    private String repo_name;

    @NotBlank(message = "Branch name is required")
    @NonNull
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
    @NonNull
    private String serverName;

    @NotBlank(message = "Username is required")
    @NonNull
    private String username;

    @NotBlank(message = "Private key is required")
    @NonNull
    private String sshKey;

    @NotBlank(message = "Docker username is required")
    @NonNull
    private String docker_username;

    @NotBlank(message = "Docker password is required")
    @NonNull
    private String docker_password;

    @NotBlank(message = "Docker repository name is required")
    @NonNull
    private String docker_repo_name;

    @NotBlank(message = "Deploying cmd is required")
    @NonNull
    private String cmd;

}
