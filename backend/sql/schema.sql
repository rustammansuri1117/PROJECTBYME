-- Run with:  npm run db:init   (or: psql -d hotel_db -f sql/schema.sql)

CREATE TABLE IF NOT EXISTS hotels (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150)  NOT NULL,
    description TEXT          NOT NULL DEFAULT '',
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    latitude    NUMERIC(9,6)  CHECK (latitude  BETWEEN -90  AND 90),
    longitude   NUMERIC(9,6)  CHECK (longitude BETWEEN -180 AND 180),
    location    VARCHAR(100),
    image_path  VARCHAR(255),              -- e.g. /uploads/1727999999999-uuid.jpg
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotels_price      ON hotels (price);
CREATE INDEX IF NOT EXISTS idx_hotels_location   ON hotels (LOWER(location));
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels (created_at DESC);
