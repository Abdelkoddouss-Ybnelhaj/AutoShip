package com.example.autoship.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ScriptResult {

    int success;
    String logs;
    List<String> artifacts;
}
