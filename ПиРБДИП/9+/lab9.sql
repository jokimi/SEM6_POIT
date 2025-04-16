-- 2. Продемонстрировать обработку данных из объектных таблиц при помощи коллекций.

---- Создать коллекцию на основе t1, далее K1, для нее как атрибут – вложенную коллекцию на основе t2, далее К2:

create or replace type products_type as object (
    product_id number,
    product_name varchar2(200),
    category_id number,
    price number(10,2),
    description varchar2(255),
    image_url varchar2(200),
    quantity number
);

create or replace type orders_type as object (
    order_id number,
    customer_id number,
    order_date date,
    total_amount number,
    status_id number
);

create or replace type products_collection as table of products_type;
create or replace type orders_collection as table of orders_type;

create or replace type products_with_orders as object (
    products products_type,
    orders orders_collection
);

create or replace type products_with_orders_collection as table of products_with_orders;

create table t1 (
    product products_collection
) nested table product store as products_table;

drop table t1;

create table t2 of orders_type;

drop table t2;

insert into t2
    select * from kem.orders;

delete from t1;

insert into t1
    values (products_collection(products_type(1, 'Jeans', 1, 60, 'Classic blue jeans', 'https://example.com/images/jeans.jpg', 10)));
insert into t1
    values (products_collection(products_type(2, 'Polo shirt', 2, 30, 'White polo shirt (M)', 'https://example.com/images/polo-shirt.jpg', 20)));
insert into t1
    values (products_collection(products_type(3, 'T-shirt with logo', 3, 20, 'Black t-shirt with logo (F)', 'https://example.com/images/logo-tshirt.jpg', 15)));

select * from t1;

---- Выяснить, является ли членом коллекции К1 какой-то произвольный элемент:

declare
    K1 products_collection;
begin
    select product into K1 from t1 where rownum = 1;
    declare
        v_product_exists boolean := false;
    begin
        for i in 1..K1.count loop
            if K1(i).product_id = 1 and K1(i).product_name = 'Jeans' then
                v_product_exists := true;
                exit;
            end if;
        end loop;
        if v_product_exists then
            dbms_output.put_line('This element is a member of K1.');
        else
            dbms_output.put_line('This element is not a member of K1.');
        end if;
    end;
end;

---- Найти пустые коллекции К1:

declare
    K1 products_collection;
begin
    select product into K1 from t1 where rownum = 1;
    if K1 is null or K1.count = 0 then
        dbms_output.put_line('Collection K1 is empty.');
    else
        dbms_output.put_line('Collection K1 is not empty.');
    end if;
end;

-- 3. Преобразовать коллекцию к другому виду (к коллекции другого типа, к реляционным данным).

declare
    all_products products_collection := products_collection();
    K1 products_collection;
    new_products_collection products_collection := products_collection();
begin
    for rec in (select product from t1) loop
        K1 := rec.product;
        for i in 1..K1.count loop
            all_products.extend;
            all_products(all_products.last) := K1(i);
        end loop;
    end loop;
    for i in 1..all_products.count loop
        if all_products(i).product_id > 1 then
            new_products_collection.extend;
            new_products_collection(new_products_collection.last) := all_products(i);
        end if;
    end loop;
    for i in 1..new_products_collection.count loop
        dbms_output.put_line('product_id: ' || new_products_collection(i).product_id || ', product_name: ' || new_products_collection(i).product_name);
    end loop;
end;

-- 4. Продемонстрировать применение BULK операций на примере своих коллекций.

create table products_bulk (
    product_id number,
    product_name varchar2(200),
    category_id number,
    price number(10,2),
    description varchar2(255),
    image_url varchar2(200),
    quantity number
);

drop table products_bulk;

declare
    v_products products_collection := products_collection();
    v_one_product products_collection;
begin
    for r in (select product from t1) loop
        v_one_product := r.product;
        for i in 1 .. v_one_product.count loop
            v_products.extend;
            v_products(v_products.count) := v_one_product(i);
        end loop;
    end loop;
    forall i in 1 .. v_products.count
        insert into products_bulk (product_id, product_name, category_id, price, description, image_url, quantity)
            values (
                v_products(i).product_id,
                v_products(i).product_name,
                v_products(i).category_id,
                v_products(i).price,
                v_products(i).description,
                v_products(i).image_url,
                v_products(i).quantity
            );
    dbms_output.put_line('Rows inserted: ' || v_products.count);
end;

select * from products_bulk;
delete from products_bulk;
