package com.example.autoship.common;

public final class MessageKeys {

    private MessageKeys() {
        throw new UnsupportedOperationException();
    }

    // info messages
    public static final String INFO_WEBHOOK_CREATED = "Webhook Created Successfully";
    public static final String INFO_REPOS_FETCHED = "Successfully Fetching Repos for user";
    public static final String INFO_DEPLOYMENT_CONFIGURATION = "Successfully Configure Deployment";

    // exception messages
    public static final String ERROR_HOOK_EXIST = "Hook already exists on this repository";
    public static final String ERROR_REPO_NOT_FOUND = "User repo not found";
    public static final String ERROR_DEPLOYMENT_CONFIGURATION = "Deployment configuration failed!";
    public static final String ERROR_GITHUB_HTTP_REQUEST = "Error while trying to send http request to github api";
    public static final String ERROR_JWT_INVALID_TOKEN = "Invalid JWT !";
}
