/* user 정보 테이블 */
create table user (
	account_id int auto_increment primary key,
	user_id varchar(255) not null,
	password varchar(255) not null,
	money int not null,
	create_at datetime DEFAULT now()
);

/* 상장된 주식 정보 테이블*/
create table stock_inform (
	stock_id int auto_increment primary key,
	name varchar (20) not null, 
	price int not null, 
	status varchar(1) not null,
	create_at datetime DEFAULT now(),
	broken_at datetime
);

/* 주식 잔고 테이블*/
create table stock_user (
	account_id int not null,
	stock_id int not null,
	stock_number int not null, 
	average_price int not null,
	PRIMARY KEY (account_id, stock_id)
);

/*주식 체결 기록 테이블*/

/**/

/*
    주식기능

    1. 주식 가격확인 
    2. 매수 매도 
    3. 잔고확인
    4. 주식 체결기록 확인
    5. 이용자들 끼리 채팅 기능
    6.자산 랭킹
*/
insert into stock_inform values(null, '문경테크놀로지', 45000, 'Y', now(), null);
insert into stock_inform values(null, '은수에어로스페이스', 80000, 'Y', now(), null);
insert into stock_inform values(null, '현우바이오', 60000, 'Y', now(), null);
insert into stock_inform values(null, '은찬식품', 30000, 'Y', now(), null);
insert into stock_inform values(null, '규빈메디컬', 40000, 'Y', now(), null);
insert into stock_inform values(null, '기태스틸', 35000, 'Y', now(), null);
