package com.example.autoship.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class EnvironmentDTO {

    Long envID;

    String serverIP;

    String serverName;

    String username;

    Timestamp createdAt;

}
