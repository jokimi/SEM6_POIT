use CHAIN_STORES;

alter table products add date date null;
select * from products;

update products set date = '2024-12-12' where product_id = 1;
update products set date = '2023-10-23' where product_id = 2;
update products set date = '2025-05-01' where product_id = 3;
update products set date = '2025-09-15' where product_id = 4;
update products set date = '2025-01-01' where product_id = 5;
update products set date = '2024-04-19' where product_id = 6;
update products set date = '2024-12-31' where product_id = 7;
update products set date = '2023-11-11' where product_id = 8;
update products set date = '2024-03-08' where product_id = 9;
update products set date = '2024-07-06' where product_id = 10;
update products set date = '2023-08-07' where product_id = 11;
update products set date = '2024-10-17' where product_id = 12;
update products set date = '2022-12-30' where product_id = 13;
update products set date = '2024-02-02' where product_id = 14;
update products set date = '2025-06-03' where product_id = 15;
update products set date = '2024-05-09' where product_id = 16;
update products set date = '2024-09-01' where product_id = 17;
update products set date = '2024-04-29' where product_id = 18;
update products set date = '2023-11-27' where product_id = 19;
update products set date = '2025-06-14' where product_id = 20;
update products set date = '2025-04-17' where product_id = 21;
update products set date = '2024-02-13' where product_id = 22;
update products set date = '2022-12-25' where product_id = 23;
update products set date = '2025-01-07' where product_id = 24;

go
create function dbo.SelectDataFunction (@StartDate date, @EndDate date)
returns table as
return (
	select * from products where date >= @StartDate and date <= @EndDate
);

go
create function dbo.SelectDataFunctionOrders (@StartDate date, @EndDate date)
returns table as
return (
	select * from orders where order_date >= @StartDate and order_date <= @EndDate
);

bulk insert products from 'D:\BSTU\6 sem\ÏèĞÁÄÈÏ\Ëàáû\11\files\toMSSQLProducts.txt'
with (
	fieldterminator = ',',
	rowterminator = '\n',
	firstrow = 2
);

select * from products;
delete from products where product_id > 24;