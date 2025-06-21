CREATE TABLE IF NOT EXISTS sellers (
  id VARCHAR(100) NOT NULL,
  pubkeyhash VARCHAR(200) DEFAULT NULL,
  address VARCHAR(200) DEFAULT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  wallet_name varchar(50) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  country VARCHAR(10) NOT NULL,
  terms_accepted BOOLEAN NOT NULL,
  rsa_version INT UNSIGNED NOT NULL,
  rsa_public_key TEXT NOT NULL,
  rsa_private_key JSON NOT NULL,
  avatar_base VARCHAR(255) NOT NULL,
  avatar_path VARCHAR(255) NOT NULL,
  public_ip VARCHAR(100) NOT NULL,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  schema_v INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sellers_email (email),
  UNIQUE KEY uq_sellers_pubkeyhash (pubkeyhash),
  UNIQUE KEY uq_sellers_username (username)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
