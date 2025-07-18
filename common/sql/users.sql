create table if not exists users(
  id VARCHAR(200) NOT NULL,
  pubkeyhash varchar(200) NOT NULL,
  username varchar(50) NOT NULL,
  address VARCHAR(200) NOT NULL,
  country varchar(10) NOT NULL,
  terms_accepted boolean NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  public_ip varchar(100) NOT NULL,
  wallet_name varchar(50) NOT NULL,
  rsa_version INT UNSIGNED NOT NULL,
  rsa_public_key TEXT NOT NULL,
  rsa_private_key JSON NOT NULL,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  schema_v INT UNSIGNED NOT NULL,
  primary key(id),
  unique (pubkeyhash)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;