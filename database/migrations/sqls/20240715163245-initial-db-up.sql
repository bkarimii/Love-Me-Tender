CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    user_type VARCHAR(30) NOT NULL
);

CREATE TABLE admins (
    user_id INTEGER,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    cyf_role VARCHAR(100),
    last_update TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bidder (
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    last_update TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE skill (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(50)
);

CREATE TABLE buyer (
    user_id INTEGER PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    last_update TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tender (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    creation_date DATE,
    announcement_date DATE,
    deadline DATE,
    description VARCHAR(255),
    cost DECIMAL(15, 2) CHECK (cost >= 0),
    status VARCHAR(100),
    last_update TIMESTAMP
);

CREATE TABLE tender_skill (
    tender_id INTEGER,
    skill_id INTEGER,
    PRIMARY KEY (tender_id, skill_id),
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id),
    FOREIGN KEY (tender_id) REFERENCES tender(id)
);

CREATE TABLE bidder_skill (
    bidder_id INTEGER,
    skill_id INTEGER,
    PRIMARY KEY (bidder_id, skill_id),
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id),
    FOREIGN KEY (bidder_id) REFERENCES bidder(user_id)
);
