/* user 정보 테이블 */
create table user (
	account_id int auto_increment primary key,
	user_id varchar(255) not null,
	password varchar(255) not null,
	email varchar(50) not null,
	money bigint not null,
	create_at datetime DEFAULT now()
);

/* 상장된 주식 정보 테이블*/
create table stock_inform (
	stock_id int auto_increment primary key,
	name varchar (20) not null, 
	price BIGINT not null, 
	status varchar(1) not null,
	create_at datetime DEFAULT now(),
	broken_at datetime
);

/* 주식 잔고 테이블*/
create table stock_user (
	account_id int not null,
	stock_id int not null,
	stock_number BIGINT not null, 
	average_price BIGINT not null,
	PRIMARY KEY (account_id, stock_id)
);

/* 선물 계좌 잔고 테이블 */
CREATE TABLE futures_user (
	account_id INT NOT NULL,
	futures_id INT NOT NULL,
	contract_number BIGINT NOT NULL, 
	average_price double NOT NULL,
	position ENUM('long', 'short') NOT NULL,
	leverage DOUBLE NOT NULL,
	at datetime not null
);

/*주식 체결 기록 테이블*/
create table stock_log (
	account_id int not null,
	stock_id int not null,
	stock_number BIGINT not null,
	price BIGINT not null,
	trading_type enum('sell','buy') not null,
	trading_at datetime
);

/*주식 가격 변동 기록 테이블*/
create table stock_pricelog (
	stock_id int not null,
	price BIGINT not null,
	log_at datetime
);

/* 선물거래가 가능한거 정보 모아둔 테이블 */
create table futures_inform (
	futures_id int auto_increment primary key,
	name varchar (20) not null, 
	price double not null, 
	status varchar(1) not null,
	create_at datetime DEFAULT now(),
	broken_at datetime
);

/* 선물 가격변동 기록 테이블*/
create table futures_pricelog (
	futures_id int not null,
	price double not null,
	log_at datetime
);

/* 채팅 내용 저장 테이블 */
create table chat_log (
	user_id varchar (255) not null,
	content varchar (512) not null
);



/* 로컬에서 최초실행시 필요한 데이터 */

drop table stock_inform;


create table stock_inform (
	stock_id int auto_increment primary key,
	name varchar (20) not null, 
	price BIGINT not null, 
	status varchar(1) not null,
	create_at datetime DEFAULT now(),
	broken_at datetime
);


/* 리셋하기 */
 
delete from futures_inform;
delete from futures_pricelog;
delete from futures_user;
delete from stock_inform;
delete from stock_log;
delete from stock_pricelog;
delete from stock_user;

insert into stock_inform values(null, '문경테크놀로지', 45000, 'Y', now(), null);
insert into stock_inform values(null, '은수에어로스페이스', 80000, 'Y', now(), null);
insert into stock_inform values(null, '현우바이오', 60000, 'Y', now(), null);
insert into stock_inform values(null, '은찬식품', 30000, 'Y', now(), null);
insert into stock_inform values(null, '규빈메디컬', 40000, 'Y', now(), null);
insert into stock_inform values(null, '기태스틸', 35000, 'Y', now(), null);
insert into stock_inform values(null, '백호포장', 15000, 'Y', now(), null);
insert into stock_inform values(null, '태양블록체인', 10200, 'Y', now(), null);

insert into stock_pricelog values(1, 45000, now());
insert into stock_pricelog values(2, 80000, now());
insert into stock_pricelog values(3, 60000, now());
insert into stock_pricelog values(4, 30000, now());
insert into stock_pricelog values(5, 40000, now());
insert into stock_pricelog values(6, 35000, now());
insert into stock_pricelog values(7, 15000, now());
insert into stock_pricelog values(8, 10200, now());

insert into futures_inform values(1, 'MCSPI', 1500, 'Y', now(), null);
insert into futures_pricelog values(1, 1500, now());



