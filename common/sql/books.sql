CREATE TABLE IF NOT EXISTS books(
  id VARCHAR(100) NOT NULL,
  seller_id VARCHAR(100) NOT NULL,
  keeping_stock BIGINT DEFAULT 0,
  ready_stock BIGINT DEFAULT 0,
  blocked_stock BIGINT DEFAULT 0,
  buy_limit BIGINT DEFAULT NULL,
  sold BIGINT DEFAULT 0,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  schema_v INT UNSIGNED NOT NULL,
  primary key(id),
  index idx_seller_id (seller_id),
  foreign key (id) REFERENCES products(id)
) ENGINE=InnoDB;
