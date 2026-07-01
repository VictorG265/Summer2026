-- ENUM типы
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TYPE order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

CREATE TYPE product_category AS ENUM (
    'MAGNETS',
    'MUGS',
    'KEYCHAINS',
    'PLATES',
    'TOYS',
    'CLOTHING',
    'OTHER'
);

CREATE TYPE product_country AS ENUM (
    'RUSSIA',
    'FRANCE',
    'ITALY',
    'GERMANY',
    'JAPAN',
    'USA',
    'OTHER'
);

-- Таблица users
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    login       VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        user_role    NOT NULL DEFAULT 'USER',
    fio         VARCHAR(150) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    phone       VARCHAR(20),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Таблица product
CREATE TABLE product (
    id          BIGSERIAL PRIMARY KEY,
    category    product_category    NOT NULL,
    country     product_country     NOT NULL,
    name        VARCHAR(150)        NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2)      NOT NULL CHECK (price >= 0),
    stock       INT                 NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images_url  JSONB               NOT NULL DEFAULT '[]'
);

-- Таблица order
CREATE TABLE "order" (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT          NOT NULL REFERENCES users(id),
    product_id     BIGINT          NOT NULL REFERENCES product(id),
    quantity       SMALLINT        NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_snapshot DECIMAL(10, 2)  NOT NULL CHECK (price_snapshot >= 0),
    status         order_status    NOT NULL DEFAULT 'PENDING',
    address        JSONB           NOT NULL,
    last_update    TIMESTAMP       NOT NULL DEFAULT NOW(),
    created_at     TIMESTAMP       NOT NULL DEFAULT NOW()
);