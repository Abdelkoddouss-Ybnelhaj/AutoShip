package com.example.autoship.exceptions;

public class WebhookAlreadyExistException extends Exception{

    public WebhookAlreadyExistException(String msg){
        super(msg);
    }
}
