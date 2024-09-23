ROLLBACK;

BEGIN;

ALTER DATABASE sigecro_db SET TIMEZONE TO 'America/La_Paz';

--DROP TABLES

DROP TABLE IF EXISTS news_tag;

DROP TABLE IF EXISTS tags;

DROP TABLE IF EXISTS news;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS permissions;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS urls;

-- TABLE CATEGORIES
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE USERS
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY, 
    name VARCHAR(128) NOT NULL
);

-- TABLE NEWS
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    source VARCHAR(64) NOT NULL,
    url VARCHAR(255),
    summary TEXT NOT NULL,
    image_url VARCHAR(300),
    status VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- TABLE PERMISSION
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL ,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE TAGS
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE NEWS_TAGS
CREATE TABLE news_tag (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- TABLE URLS
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;