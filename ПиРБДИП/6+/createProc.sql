alter session set container = ORCLPDB1;

select * from kem.orders;
select * from kem.composition_of_orders;
select * from kem.customers;
select * from kem.products;

begin 
    MakeOrder('Jeans', 1, 'user1');
    -- AddOrder(customer_id, total_amount, status_id);
    -- DeleteOrder(order_id);
    -- AddOrderComposition(order_id, product_id, quantity);
    -- DeleteOrderComposition(order_id)
end;

-------------------------------------------------------- ЗАКАЗЫ ----------------------------------------------------------------

-- процедура создания заказа

create or replace procedure AddOrder (
    p_customer_id in number,
    p_total_amount in number,
    p_status_id in number
)
as p_order_id number;
begin
    select max(order_id) into p_order_id from kem.ORDERS;
    insert into kem.ORDERS values (p_order_id + 1, p_customer_id, sysdate, p_total_amount, p_status_id);
    commit;
exception
    when no_data_found then 
        insert into kem.ORDERS values (1, p_customer_id, sysdate, p_total_amount, p_status_id);
        commit; 
    when others then
        dbms_output.put_line('AddOrder error!');
        rollback;
        raise;
end;

-- удаление заказа

create or replace procedure DeleteOrder (
    p_order_id in number
)
as
begin
    delete from kem.ORDERS where order_id = p_order_id;
    commit;
exception
    when others then 
        dbms_output.put_line('Order ' || p_order_id || ' not found!'); 
        rollback;
        raise;
end;

-- добавление состава заказа

create or replace procedure AddOrderComposition (
    p_order_id in number,
    p_product_id in number,
    p_quantity in number
)
as p_composition_id number;
begin
    select max(composition_id) into p_composition_id from kem.COMPOSITION_OF_ORDERS;
    insert into kem.COMPOSITION_OF_ORDERS values (p_order_id, p_product_id, p_quantity, p_composition_id + 1);
    commit;
    update kem.PRODUCTS set quantity = quantity - p_quantity where product_id = p_product_id;
    commit;
exception
    when no_data_found then 
        insert into kem.COMPOSITION_OF_ORDERS values (p_order_id, p_product_id, p_quantity, 1);
        commit;
    when others then
        dbms_output.put_line('AddOrderComposition error!');
        rollback;
        raise;
end;

-- удаление состава заказа

create or replace procedure DeleteOrderComposition (
    p_order_id in number
)
as
    p_quantity number;
    p_product_id number;
begin
    select quantity into p_quantity from kem.COMPOSITION_OF_ORDERS where order_id = p_order_id;
    select product_id into p_product_id from kem.COMPOSITION_OF_ORDERS where order_id = p_order_id;
    update kem.PRODUCTS set quantity = quantity + p_quantity where product_id = p_product_id;
    commit;
    delete from kem.COMPOSITION_OF_ORDERS where order_id = p_order_id;
    commit;
exception
    when others then 
        dbms_output.put_line('Composition ' || p_order_id || ' not found.'); 
        rollback;
        raise;
end;

-- оформление заказа со стороны пользователя

create or replace procedure MakeOrder (
    p_product_name in varchar,
    p_quantity in number,
    p_customer_name in varchar
) as 
    p_order_id number;
    p_customer_id number;
    p_total_amount number;
    p_product_id number;
    p_current_quantity number;
begin
    select quantity into p_current_quantity from kem.PRODUCTS where product_name = p_product_name;
    if (p_quantity > p_current_quantity) then
        dbms_output.put_line('The quantity cannot exceed the existing one!');
        return;
    end if;
    select customer_id into p_customer_id from kem.CUSTOMERS where name = p_customer_name;
    select p_quantity * price into p_total_amount from kem.PRODUCTS where product_name = p_product_name;
    select max(order_id) into p_order_id from kem.ORDERS;
    select product_id into p_product_id from kem.PRODUCTS where product_name = p_product_name;
    AddOrder(p_customer_id, p_total_amount, 4);
    AddOrderComposition(p_order_id + 1, p_product_id, p_quantity); 
exception
    when no_data_found then
        dbms_output.put_line('Product does not exist!'); 
    when others then 
        dbms_output.put_line('MakeOrder error!'); 
        rollback;
        raise;
end;