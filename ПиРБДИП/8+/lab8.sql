-- 2. Создать дополнительный конструктор, метод сравнения, функцию и процедуру как методы экземпляра.

create or replace type product_type force as object (
    product_id number,
    product_name varchar2(200),
    category_id number,
    price number(10,2),
    description varchar2(255),
    image_url varchar2(200),
    quantity number,
    total_price_generated number,
    -- Дополнительный конструктор
    constructor function product_type(
        product_id number,
        product_name varchar2,
        category_id number,
        price number,
        description varchar2,
        image_url varchar2,
        quantity number,
        total_price_generated number
    ) return self as result,
    -- Метод сравнения MAP
    map member function product_map return varchar2 deterministic,
    -- Функция в качестве метода экземпляра
    member function GetTotalPrice return number deterministic,
    -- Процедура в качестве метода экземпляра
    member procedure IncreaseQuantity(p_quantity number) deterministic
);

create or replace type body product_type as
    -- Дополнительный конструктор
    constructor function product_type(
        product_id number,
        product_name varchar2,
        category_id number,
        price number,
        description varchar2,
        image_url varchar2,
        quantity number,
        total_price_generated number
    ) return self as result is
    begin
        self.product_id := product_id;
        self.product_name := product_name;
        self.category_id := category_id;
        self.price := price;
        self.description := description;
        self.image_url := image_url;
        self.quantity := quantity;
        self.total_price_generated := price * quantity;
        return;
    end;
    -- Метод сравнения MAP
    map member function product_map return varchar2 deterministic is
    begin
        return product_name || ' | ' || price || ' | ' || quantity;
    end;
    -- функция в качестве метода экземпляра
    member function GetTotalPrice return number deterministic is
    begin
        return price * quantity;
    end;
    -- процедура в качестве метода экземпляра
    member procedure IncreaseQuantity(p_quantity number) deterministic is
    begin
        quantity := quantity + p_quantity;
    end;
end;

create or replace type order_type force as object (
    order_id number,
    customer_id number,
    order_date date,
    total_amount number,
    status_id number,
    -- дополнительный конструктор
    constructor function order_type(
        order_id number,
        customer_id number,
        order_date date,
        total_amount number,
        status_id number
    ) return self as result,
    -- метод сравнения MAP
    map member function order_map return varchar2 deterministic,
    -- функция в качестве метода экземпляра
    member function GetStatusDescription return varchar2 deterministic,
    -- процедура в качестве метода экземпляра
    member procedure UpdateStatus(p_status_id number) deterministic
);

create or replace type body order_type as
    -- дополнительный конструктор
    constructor function order_type(
        order_id number,
        customer_id number,
        order_date date,
        total_amount number,
        status_id number
    ) return self as result is
    begin
        self.order_id := order_id;
        self.customer_id := customer_id;
        self.order_date := order_date;
        self.total_amount := total_amount;
        self.status_id := status_id;
        return;
    end;
    -- метод сравнения map
    map member function order_map return varchar2 deterministic is
    begin
        return 'order id: ' || order_id || ', customer id: ' || customer_id || ', order date: ' || 
        to_char(order_date, 'dd-mon-yyyy') || ', total amount: ' || total_amount;
    end;
    -- функция в качестве метода экземпляра
    member function GetStatusDescription return varchar2 deterministic is
        status_desc varchar2(100);
    begin
        -- описание статуса по его идентификатору
        if status_id = 1 then
            status_desc := 'Paid';
        elsif status_id = 2 then
            status_desc := 'Delivered';
        elsif status_id = 3 then
            status_desc := 'Cancelled';
        elsif status_id = 4 then
            status_desc := 'In processing';
        end if;
        return status_desc;
    end;
    -- процедура в качестве метода экземпляра
    member procedure UpdateStatus(p_status_id number) deterministic is
    begin
        status_id := p_status_id;
    end;
end;

-- 3. Скопировать данные из реляционных таблиц в объектные.

create table object_products of product_type;
drop table object_products;
create table object_orders of order_type;
drop table object_orders;

insert into object_products(product_id, product_name, category_id, price, description, image_url, quantity, total_price_generated)
select 
    product_id, 
    product_name, 
    category_id, 
    price, 
    description, 
    image_url, 
    quantity, 
    price * quantity
from kem.products;

insert into object_orders
    select * from kem.orders;

select product.GetTotalPrice() from object_products product;
select orderr.GetStatusDescription() from object_orders orderr where orderr.order_id = 2;

-- 4. Продемонстрировать применение объектных представлений.

create or replace view product_view of product_type with object identifier (product_id) as 
    select * from object_products;

select product_name, price from product_view;

-- 5. Продемонстрировать применение индексов для индексирования по атрибуту и по методу в объектной таблице.

update object_products op set total_price_generated = op.GetTotalPrice();

create bitmap index idx_status on object_orders (status_id);
create bitmap index idx_total_price ON object_products(total_price_generated);
drop index idx_status;
drop index idx_total_price;

select status_id, count(*) as count from object_orders
    group by status_id
    order by count;

select count(*) as product_count, total_price_generated from object_products
    group by total_price_generated having total_price_generated > 100;