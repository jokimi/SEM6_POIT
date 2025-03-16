alter session set container = ORCLPDB1;
ALTER SESSION SET CURRENT_SCHEMA = KEM;

CREATE USER KEMDB IDENTIFIED BY kemdb
DEFAULT TABLESPACE USERS 
TEMPORARY TABLESPACE TEMP 
QUOTA UNLIMITED ON USERS;

create table KEM.PRODUCT_CATEGORIES
(
    category_id number primary key,
    category_name varchar(200) not null
);

create table KEM.PRODUCTS
(
    product_id number primary key,
    product_name varchar(200) not null,
    category_id number,
    price number(10,2) not null,
    description varchar(255),
    image_url varchar(200),
    quantity number default 0,
    foreign key (category_id) references KEM.PRODUCT_CATEGORIES(category_id)
);

create table KEM.CUSTOMERS
(
    customer_id number primary key,
    name varchar2(100) unique,
    email varchar2(100),
    phone_number varchar2(20),
    address varchar2(200)
);

create table KEM.ORDER_STATUSES 
(
    status_id number primary key,
    status_name varchar2(50) not null
);

create table KEM.ORDERS
(
    order_id number primary key,
    customer_id number,
    order_date date,
    total_amount number,
    status_id number,
    foreign key (customer_id) references KEM.CUSTOMERS(customer_id),
    foreign key (status_id) references KEM.ORDER_STATUSES(status_id)
);

create table KEM.COMPOSITION_OF_ORDERS
(
    order_id number,
    product_id number,
    quantity number,
    composition_id number primary key,
    foreign key (order_id) references KEM.ORDERS(order_id),
    foreign key (product_id) references KEM.PRODUCTS(product_id)
);

create table KEM.CARTS
(
    cart_id number primary key,
    customer_id number,
    foreign key (customer_id) references KEM.CUSTOMERS(customer_id)
);

create table KEM.CART_ITEMS
(
    cart_item_id number primary key,
    cart_id number,
    product_id number,
    quantity number,
    foreign key (cart_id) references KEM.CARTS(cart_id),
    foreign key (product_id) references KEM.PRODUCTS(product_id)
);

create index idx_products_product_name on KEM.PRODUCTS (product_name);
create index idx_product_categories_category_name on KEM.PRODUCT_CATEGORIES (category_name);
create index idx_customer_phone_number on KEM.CUSTOMERS (phone_number);

-- количество проданных товаров по периодам
create materialized view KEM.SALES_BY_PERIOD_view refresh complete on commit
as
    select to_char(o.order_date, 'YYYY-MM') as month, p.product_name, sum(co.quantity) as total_quantity
        from KEM.ORDERS o
            join KEM.COMPOSITION_OF_ORDERS co on o.order_id = co.order_id
            join KEM.PRODUCTS p on co.product_id = p.product_id
        group by to_char(o.order_date, 'YYYY-MM'), p.product_name
        order by month desc;

-- попул€рные товары
create materialized view KEM.POPULAR_PRODUCTS_view refresh complete on commit
as
    select p.product_name, sum(co.quantity) as total_quantity
        from KEM.COMPOSITION_OF_ORDERS co
            join KEM.PRODUCTS p on co.product_id = p.product_id
        group by p.product_name
        order by total_quantity desc;
        
-- общее количество товара
create materialized view TOTAL_AMOUNT_OF_PRODUCTS_view refresh complete on commit
as
    select product_name, quantity from KEM.PRODUCTS;
    
-- процедура дл€ просмотра количества проданных товаров по периодам
create or replace procedure SalesByPeriod
as
begin
    for rec in (select * from KEM.SALES_BY_PERIOD_view)
    loop
        dbms_output.put_line('Month: ' || rec.MONTH || ', Product Name: ' || rec.PRODUCT_NAME || ', Total Quantity: ' || rec.TOTAL_QUANTITY);
    end loop;
end;

-- процедура дл€ просмотра попул€рных товаров
create or replace procedure DisplayPopularProducts
as
begin
    for rec in (select * from KEM.POPULAR_PRODUCTS_view)
    loop
        dbms_output.put_line('Product Name: ' || rec.product_name || ', Total Quantity: ' || rec.total_quantity);
    end loop;
end;

-- процедура дл€ вывода общего количества товара
create or replace procedure DisplayTotalAmountOfProducts
as
begin
    for rec in (select * from KEM.TOTAL_AMOUNT_OF_PRODUCTS_view where product_name not like 'Product%')
    loop
        dbms_output.put_line('Product Name: ' || rec.product_name || ', Quantity: ' || rec.quantity);
    end loop;
end;

-- процедура дл€ вывода информации о существующих категори€х
create or replace procedure DisplayProductCategories
as
begin
    for rec in (select * from KEM.PRODUCT_CATEGORIES)
    loop
        dbms_output.put_line('Category Name: ' || rec.category_name);
    end loop;
end;

-- процедура дл€ вывода информации обо всех заказах
create or replace procedure DisplayOrderInformation
as
begin
    for rec in (
        select c.name as customer_name, p.product_name, o.order_date, o.total_amount, os.status_name as order_status
            from KEM.CUSTOMERS c
                join KEM.ORDERS o on c.customer_id = o.customer_id
                join KEM.COMPOSITION_OF_ORDERS co on o.order_id = co.order_id
                join KEM.PRODUCTS p on co.product_id = p.product_id
                join KEM.ORDER_STATUSES os on o.status_id = os.status_id
    )
    loop
        dbms_output.put_line('Customer Name: ' || rec.customer_name || ', Product Name: ' || rec.product_name ||
            ', Order Date: ' || to_char(rec.order_date, 'DD-MON-YYYY') || ', Total Amount: ' || rec.total_amount ||
            ', Order Status: ' || rec.order_status);
    end loop;
    exception
        when others then
        dbms_output.put_line('ERROR');
        rollback;
        raise;
end;

-- процедура дл€ вывода пользователей
create or replace procedure DisplayCustomerInformation
as
begin
    for rec in (select * from KEM.CUSTOMERS)
    loop
        dbms_output.put_line('Customer ID: ' || rec.customer_id || ', Name: ' || rec.name ||
            ', Email: ' || rec.email || ', Phone Number: ' || rec.phone_number || ', Address: ' || rec.address);
    end loop;
    exception
        when others then
            dbms_output.put_line('ERROR');
        rollback;
        raise;
end;

-- функци€ дл€ вывода общей суммы всех заказов клиента
CREATE OR REPLACE FUNCTION GetTotalOrderAmount(CustomerId IN NUMBER)
RETURN NUMBER
IS
    TotalAmount NUMBER;
BEGIN
    SELECT COALESCE(SUM(total_amount), 0) INTO TotalAmount FROM KEM.ORDERS WHERE customer_id = CustomerId;
    RETURN TotalAmount;
END;

-- последовательность дл€ ID заказов
create sequence OrderSeq  
    start with 1  
    increment by 1  
    nocache  
    nocycle;

-- обновление суммы заказа на основе всех товаров в заказе
CREATE OR REPLACE TRIGGER trg_UpdateTotalAmount  
AFTER INSERT OR UPDATE ON KEM.COMPOSITION_OF_ORDERS  
DECLARE
BEGIN
    UPDATE KEM.ORDERS o
    SET o.total_amount = (
        SELECT COALESCE(SUM(p.price * c.quantity), 0)
        FROM KEM.COMPOSITION_OF_ORDERS c
        JOIN KEM.PRODUCTS p ON c.product_id = p.product_id
        WHERE c.order_id = o.order_id
    )
    WHERE o.order_id IN (SELECT DISTINCT order_id FROM KEM.COMPOSITION_OF_ORDERS);
END;