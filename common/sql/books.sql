CREATE TABLE IF NOT EXISTS books(
  id VARCHAR(100) NOT NULL,
  seller_id VARCHAR(100) NOT NULL,
  keeping_stock INT DEFAULT 0,
  ready_stock INT DEFAULT 0,
  blocked_stock INT DEFAULT 0,
  purchase_limit BOOLEAN DEFAULT FALSE,
  purchase_limit_value INT DEFAULT NULL,
  stop_purchases BOOLEAN DEFAULT FALSE,
  sold_count INT DEFAULT 0,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  schema_v INT UNSIGNED NOT NULL,
  primary key(id),
  index idx_seller_id (seller_id)
) ENGINE=InnoDB;
