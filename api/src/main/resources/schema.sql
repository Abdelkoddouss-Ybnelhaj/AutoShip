
CREATE TABLE IF NOT EXISTS environments (
    env_id BIGINT NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    server_ip VARCHAR(255) NOT NULL,
    server_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    ssh_key TEXT NOT NULL,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS deployments (
    dep_id BIGINT NOT NULL PRIMARY KEY,
    listenerID BIGINT,
    cmd VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    logs TEXT,
    event VARCHAR(25) NOT NULL,
    commit VARCHAR(255) ,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);


CREATE TABLE IF NOT EXISTS builds (
    build_id BIGINT NOT NULL PRIMARY KEY,
    dep_id BIGINT,
    status VARCHAR(255) NOT NULL,
    logs TEXT NOT NULL,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);
