package com.example.autoship.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeploymentConfigDTO {

    String repo_name;

    String branch;

    List<String> events = new ArrayList<>();

    String serverName;

    Timestamp creating_time;

    Long listenerID;


    public void addEvent(String event){
        events.add(event);
    }

}
