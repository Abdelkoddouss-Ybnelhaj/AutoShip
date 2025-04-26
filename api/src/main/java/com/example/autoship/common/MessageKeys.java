package com.example.autoship.common;

public final class MessageKeys {

    private MessageKeys() {
        throw new UnsupportedOperationException();
    }

    // info messages
    public static final String INFO_WEBHOOK_CREATED = "Webhook Created Successfully";
    public static final String INFO_REPOS_FETCHED = "Successfully Fetching Repos for user";
    public static final String INFO_DEPLOYMENT_CONFIGURATION = "Successfully Configure Deployment";
    public static final String INFO_FETCHING_DEPLOYMENTS = "Successfully Fetching All Deployments";
    public static final String INFO_FETCHING_DEPLOYMENT_CONFIGS = "Successfully Fetching All Deployments Configs";
    public static final String INFO_FETCHING_DEPLOYMENT_CONFIG = "Successfully Fetching Deployment Configuration";
    public static final String INFO_DELETING_DEPLOYMENT_CONFIG = "Successfully Deleting Deployment Configuration";
    public static final String INFO_FETCHING_DEPLOYMENT_DETAILS = "Successfully Fetching Deployment Details";
    public static final String INFO_FETCHING_ENVIRONMENTS = "Successfully Fetching All Environments";
    public static final String INFO_FETCHING_ENVIRONMENT_DETAILS = "Successfully Fetching Environment Details";
    // exception messages
    public static final String ERROR_UNEXPECTED_ERROR = "Unexpected Error occurred !";
    public static final String ERROR_HOOK_EXIST = "Hook already exists on this repository";
    public static final String ERROR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERROR_DEPLOYMENT_CONFIGURATION = "Deployment configuration failed!";
    public static final String ERROR_GITHUB_HTTP_REQUEST = "Error while trying to send http request to github api";
    public static final String ERROR_JWT_INVALID_TOKEN = "Invalid JWT !";
    public static final String ERROR_DEPLOYMENT_NOT_FOUND = "Deployment Not Found";
}
