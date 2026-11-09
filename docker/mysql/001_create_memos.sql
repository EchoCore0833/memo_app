create table if not exists memos(
    id int auto_increment primary key,
    title varchar(255) not null,
    content text not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    deleted_at datetime default null
)