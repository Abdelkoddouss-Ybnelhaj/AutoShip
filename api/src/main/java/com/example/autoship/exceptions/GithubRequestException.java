package com.example.autoship.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class GithubRequestException extends Exception{

    int status;

    public GithubRequestException(String msg,int status){
        super(msg);
        this.status = status;
    }
}
