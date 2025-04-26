package com.example.autoship.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
public class DepDetailsDTO {

    Long depID;
    String repo_name;
    String branch;
    String event;
    String commit;
    String dep_status;
    String build_status;
    String dep_logs;
    String build_logs;
    String cmd;
    List<String> artifacts;
    Timestamp creating_time;

}
