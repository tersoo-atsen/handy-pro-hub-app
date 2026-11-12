-- Enable required PostgreSQL extensions

CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA "extensions";    -- Geo-spatial queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA "extensions";    -- Trigram fuzzy text search

-- Note: gen_random_uuid() is built into PostgreSQL 13+ and does not require uuid-ossp.
-- All tables use gen_random_uuid() instead of gen_random_uuid().
