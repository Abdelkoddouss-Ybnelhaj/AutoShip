package com.example.autoship.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class DeploymentDTO {

    Long depID;
    String repo_name;
    String branch;
    String event;
    String commit;
    String dep_status;
    Timestamp creating_time;

}
