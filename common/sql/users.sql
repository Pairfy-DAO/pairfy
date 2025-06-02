create table if not exists users(
  pubkeyhash varchar(200) NOT NULL,
  username varchar(50) NOT NULL,
  address VARCHAR(200) NOT NULL,
  country varchar(10) NOT NULL,
  terms_accepted boolean NOT NULL,
  public_ip varchar(100) NOT NULL,
  wallet_name varchar(50) NOT NULL,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  schema_v INT UNSIGNED NOT NULL,
  primary key(pubkeyhash)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;