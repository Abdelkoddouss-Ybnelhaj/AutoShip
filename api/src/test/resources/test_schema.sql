
CREATE TABLE environments (
    env_id BIGINT NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    repo_id BIGINT,
    server_ip VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    ssh_key TEXT NOT NULL,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);

CREATE TABLE deployments (
    dep_id BIGINT NOT NULL PRIMARY KEY,
    listenerID BIGINT,
    cmd VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    logs TEXT,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);


CREATE TABLE builds (
    build_id BIGINT NOT NULL PRIMARY KEY,
    dep_id BIGINT,
    status VARCHAR(255) NOT NULL,
    logs TEXT NOT NULL,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);
