package com.example.autoship.mapper;

import com.example.autoship.dtos.response.DepDetailsDTO;
import com.example.autoship.dtos.response.DeploymentConfigDTO;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class DeploymentMapperTest {

    @Test
    void testMapToDepDetailsDTO() {
        // Simuler des résultats comme ceux renvoyés par getDeploymentDetails
        List<Object[]> queryResult = new ArrayList<>();

        Timestamp createdAt = Timestamp.valueOf("2024-04-18 15:30:00");

        queryResult.add(new Object[]{
                1L,                     // dep_id
                "example-repo",         // repo_name
                "main",                 // branch
                "push",                 // event
                "SUCCESS",              // dep_status
                "PASSED",               // build_status
                "Deployment log text",  // dep_logs
                "Build log text",       // build_logs
                "docker run xyz",       // cmd
                "artifact1.jar",        // artifact name
                createdAt               // created_at
        });

        queryResult.add(new Object[]{
                1L, "example-repo", "main", "push", "SUCCESS", "PASSED",
                "Deployment log text", "Build log text", "docker run xyz",
                "artifact2.jar", createdAt
        });

        // Appeler la méthode à tester
        DepDetailsDTO dto = DeploymentMapper.mapToDepDetailsDTO(queryResult);

        // Assertions
        assertNotNull(dto);
        assertEquals(1L, dto.getDepID());
        assertEquals("example-repo", dto.getRepo_name());
        assertEquals("main", dto.getBranch());
        assertEquals("push", dto.getEvent());
        assertEquals("SUCCESS", dto.getDep_status());
        assertEquals("PASSED", dto.getBuild_status());
        assertEquals("Deployment log text", dto.getDep_logs());
        assertEquals("Build log text", dto.getBuild_logs());
        assertEquals("docker run xyz", dto.getCmd());
        assertEquals(createdAt, dto.getCreating_time());

        // Vérifier la liste des artefacts
        List<String> expectedArtifacts = Arrays.asList("artifact1.jar", "artifact2.jar");
        assertEquals(expectedArtifacts, dto.getArtifacts());
    }


    @Test
    void testMapToDeploymentConfigDTOs_GroupsEventsCorrectly() {
        // Simuler un résultat SQL brut
        List<Object[]> queryResult = new ArrayList<>();
        Timestamp createdAt1 = Timestamp.valueOf("2024-04-19 12:00:00");
        Timestamp createdAt2 = Timestamp.valueOf("2024-04-18 09:45:00");

        queryResult.add(new Object[]{"repo1", "main", "push", "server-1", createdAt1,1L});
        queryResult.add(new Object[]{"repo1", "main", "pull_request", "server-1", createdAt1,1L});
        queryResult.add(new Object[]{"repo2", "dev", "deploy", "server-2", createdAt2,2L});

        // Appeler la méthode à tester
        List<DeploymentConfigDTO> dtos = DeploymentMapper.mapToDeploymentConfigDTOs(queryResult);

        // Vérifications
        assertNotNull(dtos);
        assertEquals(2, dtos.size());

        // Tester la première config
        DeploymentConfigDTO firstConfig = dtos.stream()
                .filter(dto -> dto.getRepo_name().equals("repo1"))
                .findFirst()
                .orElse(null);

        assertNotNull(firstConfig);
        assertEquals("repo1", firstConfig.getRepo_name());
        assertEquals("main", firstConfig.getBranch());
        assertEquals("server-1", firstConfig.getServerName());
        assertEquals(createdAt1, firstConfig.getCreating_time());
        assertTrue(firstConfig.getEvents().containsAll(Arrays.asList("push", "pull_request")));
        assertEquals(2, firstConfig.getEvents().size());

        // Tester la deuxième config
        DeploymentConfigDTO secondConfig = dtos.stream()
                .filter(dto -> dto.getRepo_name().equals("repo2"))
                .findFirst()
                .orElse(null);

        assertNotNull(secondConfig);
        assertEquals("repo2", secondConfig.getRepo_name());
        assertEquals("dev", secondConfig.getBranch());
        assertEquals("server-2", secondConfig.getServerName());
        assertEquals(createdAt2, secondConfig.getCreating_time());
        assertEquals(List.of("deploy"), secondConfig.getEvents());
    }



    @Test
    void should_map_query_result_to_deployment_dto_correctly() {
        // given
        List<Object[]> queryResult = List.of(
                new Object[]{"repo1", "main", "push", "server01", Timestamp.valueOf("2025-04-19 12:00:00"), "listener123"},
                new Object[]{"repo1", "main", "pull", "server01", Timestamp.valueOf("2025-04-19 12:00:00"), "listener123"}
        );

        // when
        DeploymentConfigDTO dto = DeploymentMapper.mapToDeploymentConfigDTO(queryResult);

        // then
        assertThat(dto).isNotNull();
        assertThat(dto.getRepo_name()).isEqualTo("repo1");
        assertThat(dto.getBranch()).isEqualTo("main");
        assertThat(dto.getServerName()).isEqualTo("server01");
        assertThat(dto.getCreating_time()).isEqualTo(Timestamp.valueOf("2025-04-19 12:00:00"));
        assertThat(dto.getListenerID()).isEqualTo("listener123");
        assertThat(dto.getEvents()).containsExactly("push", "pull");
    }


}
