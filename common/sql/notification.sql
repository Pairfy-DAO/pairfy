create table if not exists notifications(
  id varchar(100) not null,
  type varchar(50) not null,
  title varchar(100) not null,
  owner varchar(100) not null,
  seen boolean default false,
  data text not null,
  message text not null,
  created_at timestamp default current_timestamp,
  primary key(id),
  INDEX idx_query (owner,seen)
) ENGINE=InnoDB;

