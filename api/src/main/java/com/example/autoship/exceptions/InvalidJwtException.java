package com.example.autoship.exceptions;

public class InvalidJwtException extends RuntimeException{

    public InvalidJwtException(String msg){
        super(msg);
    }
}
