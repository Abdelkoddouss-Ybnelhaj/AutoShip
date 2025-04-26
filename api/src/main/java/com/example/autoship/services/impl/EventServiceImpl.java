package com.example.autoship.services.impl;

import com.example.autoship.models.Event;
import com.example.autoship.models.WebhookListener;
import com.example.autoship.repositories.EnvironmentRepository;
import com.example.autoship.repositories.EventRepository;
import com.example.autoship.services.EventService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private EventRepository eventRepository;

    @Override
    public void addEvents(WebhookListener listener, List<String> events) {

        log.debug("Saving events for listener ID: {}",listener.getListenerID());
        for (String event : events) {
            Event eventEntity = new Event(listener.getListenerID(), event);
            eventRepository.save(eventEntity);
            log.info("Event saved for listener ID:{}", listener.getListenerID());
        }
    }
}
