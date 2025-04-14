package com.example.autoship.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BuildResult {

    int existCode;
    List<String> artifacts;
}
