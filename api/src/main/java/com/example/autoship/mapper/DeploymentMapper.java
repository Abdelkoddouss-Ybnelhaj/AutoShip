package com.example.autoship.mapper;


import com.example.autoship.dtos.response.DepDetailsDTO;
import com.example.autoship.dtos.response.DeploymentConfigDTO;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DeploymentMapper {


    public static DepDetailsDTO mapToDepDetailsDTO(List<Object[]> queryResult) {
        if (queryResult == null || queryResult.isEmpty()) {
            return null;
        }

        List<String> artifacts = new ArrayList<>();
        Object[] firstRow = queryResult.get(0);

        Long depID = ((Number) firstRow[0]).longValue();
        String repoName = (String) firstRow[1];
        String branch = (String) firstRow[2];
        String event = (String) firstRow[3];
        String commit = (String) firstRow[4];
        String depStatus = (String) firstRow[5];
        String buildStatus = (String) firstRow[6];
        String depLogs = (String) firstRow[7];
        String buildLogs = (String) firstRow[8];
        String cmd = (String) firstRow[9];
        Timestamp createdAt = (Timestamp) firstRow[11];  // Attention, index 10 car `a.name` est [9]

        for (Object[] row : queryResult) {
            String artifact = (String) row[9]; // a.name est à l'index 9
            if (artifact != null) {
                artifacts.add(artifact);
            }
        }

        return new DepDetailsDTO(
                depID,
                repoName,
                branch,
                event,
                commit,
                depStatus,
                buildStatus,
                depLogs,
                buildLogs,
                cmd,
                artifacts,
                createdAt
        );
    }

    public static List<DeploymentConfigDTO> mapToDeploymentConfigDTOs(List<Object[]> queryResult) {
        if (queryResult == null || queryResult.isEmpty()) {
            return null;
        }

        Map<String, DeploymentConfigDTO> map = new LinkedHashMap<>();

        for (Object[] row : queryResult) {
            String repoName = (String) row[0];
            String branch = (String) row[1];
            String event = (String) row[2];
            String serverName = (String) row[3];
            Timestamp createdAt = (Timestamp) row[4];
            Long listenerID = (Long) row[5];

            // clé unique par config sans l'événement
            String key = repoName + "|" + branch + "|" + serverName + "|" + createdAt;

            // Si déjà existant, on ajoute juste l'event
            if (map.containsKey(key)) {
                map.get(key).getEvents().add(event);
            } else {
                // Sinon on crée une nouvelle entrée
                List<String> events = new ArrayList<>();
                events.add(event);

                DeploymentConfigDTO dto = new DeploymentConfigDTO(
                        repoName,
                        branch,
                        events,
                        serverName,
                        createdAt,
                        listenerID
                );
                map.put(key, dto);
            }
        }

        return new ArrayList<>(map.values());
    }

    public static DeploymentConfigDTO mapToDeploymentConfigDTO(List<Object[]> queryResult) {
        if (queryResult == null || queryResult.isEmpty()) {
            return null;
        }

        DeploymentConfigDTO resp = new DeploymentConfigDTO();
        Object[] row = queryResult.getFirst();

        resp.setRepo_name((String) row[0]);
        resp.setBranch((String) row[1]);
        resp.setServerName((String) row[3]);
        resp.setCreating_time((Timestamp) row[4]);
        resp.setListenerID((Long) row[5]);

        for(Object[] obj : queryResult){
            resp.addEvent((String) obj[2]);
        }

        return resp;
    }


}
