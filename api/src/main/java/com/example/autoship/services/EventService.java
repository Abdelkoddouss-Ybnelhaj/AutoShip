package com.example.autoship.services;

import com.example.autoship.models.WebhookListener;

import java.util.List;

public interface EventService {
    void addEvents(WebhookListener listener, List<String> events);
}
