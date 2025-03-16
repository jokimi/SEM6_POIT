use CHAIN_STORES;

create table PRODUCT_CATEGORIES (
    category_id int primary key,
    category_name varchar(200) not null
);

create table PRODUCTS (
    product_id int primary key,
    product_name varchar(200) not null,
    category_id int,
    price int not null,
    description varchar(255),
    image_url varchar(200),
    quantity int default 0,
    foreign key (category_id) references PRODUCT_CATEGORIES (category_id)
);

create table CUSTOMERS (
    customer_id int primary key,
    name varchar(100) unique,
    email varchar(100),
    phone_number varchar(20),
    address varchar(200)
);

create table ORDER_STATUSES (
	status_id int primary key,
	status_name varchar(50) not null
);

create table ORDERS (
	order_id int primary key,
	customer_id int,
	order_date date,
	total_amount int,
	status_id int,
	foreign key (customer_id) references CUSTOMERS (customer_id),
	foreign key (status_id) references ORDER_STATUSES (status_id)
);

create table COMPOSITION_OF_ORDERS (
	order_id int,
	product_id int,
	quantity int,
	composition_id int primary key,
	foreign key (order_id) references ORDERS (order_id),
	foreign key (product_id) references PRODUCTS (product_id)
);

create table CARTS (
	cart_id int primary key,
	customer_id int,
	foreign key (customer_id) references CUSTOMERS (customer_id)
);

create table CART_ITEMS (
	cart_item_id int primary key,
	cart_id int,
	product_id int,
	quantity int,
	foreign key (cart_id) references CARTS (cart_id),
	foreign key (product_id) references PRODUCTS (product_id)
);

create index idx_products_product_name on PRODUCTS (product_name);
create index idx_product_categories_category_name on PRODUCT_CATEGORIES (category_name);
create index idx_customer_phone_number on CUSTOMERS (phone_number);

-- количество проданных товаров по периодам
go
create view SALES_BY_PERIOD_view with schemabinding as
	select convert(varchar(7), o.order_date, 120) as month, p.product_name, sum(co.quantity) as total_quantity
		from dbo.ORDERS o
			join dbo.COMPOSITION_OF_ORDERS co on o.order_id = co.order_id
			join dbo.PRODUCTS p on co.product_id = p.product_id
		group by convert(varchar(7), o.order_date, 120), p.product_name;

-- попул€рные товары
go
create view POPULAR_PRODUCTS_view with schemabinding as
    select p.product_name, sum(co.quantity) as total_quantity
		from dbo.COMPOSITION_OF_ORDERS co
			join dbo.PRODUCTS p on co.product_id = p.product_id
		group by p.product_name;

-- общее количество товара
go
create view TOTAL_AMOUNT_OF_PRODUCTS_view with schemabinding as
    select product_name, quantity from dbo.PRODUCTS;

-- процедура дл€ просмотра количества проданных товаров по периодам
go
create procedure SalesByPeriod
as
begin
    select * from SALES_BY_PERIOD_view;
end;

-- процедура дл€ просмотра попул€рных товаров
go
create procedure DisplayPopularProducts
as
begin
    select * from POPULAR_PRODUCTS_view;
end;

-- процедура дл€ вывода общего количества товара
go
create procedure DisplayTotalAmountOfProducts
as
begin
    select * from TOTAL_AMOUNT_OF_PRODUCTS_view;
end;

-- процедура дл€ вывода информации о существующих категори€х
go
create or alter procedure DisplayProductCategories
as
begin
    declare @category_name varchar(100);
    declare cur_product_categories cursor for
		select category_name from PRODUCT_CATEGORIES;
    open cur_product_categories;
    fetch next from cur_product_categories into @category_name;
    while @@fetch_status = 0
    begin
        print 'Category Name: ' + @category_name;
        fetch next from cur_product_categories into @category_name;
    end;
    close cur_product_categories;
    deallocate cur_product_categories;
end;

-- процедура дл€ вывода информации обо всех заказах
go
create or alter procedure DisplayOrderInformation
as
begin
    set nocount on;
    begin try
        select c.name as customer_name, p.product_name, o.order_date, o.total_amount, os.status_name as order_status
			from CUSTOMERS c
				join ORDERS o on c.customer_id = o.customer_id
				join COMPOSITION_OF_ORDERS co on o.order_id = co.order_id
				join PRODUCTS p on co.product_id = p.product_id
				join ORDER_STATUSES os on o.status_id = os.status_id
			order by o.order_date;
    end try
    begin catch
        print 'ќшибка при выполнении процедуры';
        throw;
    end catch;
end;

-- процедура дл€ вывода пользователей
go
create or alter procedure DisplayCustomerInformation
as
begin
    set nocount on;
    begin try
        select customer_id, name, email, phone_number, address from CUSTOMERS;
    end try
    begin catch
        print 'ќшибка при выполнении процедуры';
        throw;
    end catch;
end;

-- функци€ дл€ вывода общей суммы всех заказов клиента
create or alter function GetTotalOrderAmount(@CustomerId int)
returns int
as
begin
    declare @TotalAmount int;
    select @TotalAmount = sum(total_amount) from ORDERS where customer_id = @CustomerId;
    return coalesce(@TotalAmount, 0);
end;

-- последовательность дл€ ID заказов
create sequence OrderSeq  
    as int  
    start with 1  
    increment by 1;  

-- обновление суммы заказа на основе всех товаров в заказе
go
create trigger trg_UpdateTotalAmount on COMPOSITION_OF_ORDERS after insert, update
as
begin
    set nocount on;
    update ORDERS set total_amount = (
        select sum(p.price * c.quantity)
			from COMPOSITION_OF_ORDERS c join PRODUCTS p on c.product_id = p.product_id
			where c.order_id = ORDERS.order_id
    )
    where order_id in (select order_id from inserted);
end;