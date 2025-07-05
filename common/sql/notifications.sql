create table if not exists notifications(
  id VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  owner VARCHAR(100) NOT NULL,
  seen BOOLEAN DEFAULT FALSE,
  data TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at BIGINT UNSIGNED NOT NULL,
  updated_at BIGINT UNSIGNED NOT NULL,
  primary key(id),
  INDEX idx_query (owner,seen)
) ENGINE=InnoDB;

