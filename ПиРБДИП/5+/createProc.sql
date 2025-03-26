use CHAIN_STORES;

select * from orders;
select * from composition_of_orders;
select * from customers;

-- процедура создани€ заказа

go
create or alter procedure AddOrder
    @p_customer_id int,
    @p_total_amount decimal,
    @p_status_id int
as
begin
    declare @p_order_id int;
    select @p_order_id = max(order_id) from orders;
    set @p_order_id = isnull(@p_order_id, 0) + 1;
    begin try
        begin transaction;
        insert into orders (order_id, customer_id, order_date, total_amount, status_id)
			values (@p_order_id, @p_customer_id, getdate(), @p_total_amount, @p_status_id);
        commit;
    end try
    begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;

-- удаление заказа

go
create or alter procedure DeleteOrder
    @p_order_id int
as
begin
    begin try
        begin transaction;
        delete from orders where order_id = @p_order_id;
        if @@rowcount = 0
			begin
				raiserror('«аказ %d не найден.', 16, 1, @p_order_id);
				rollback;
				return;
        end
        commit;
    end try
    begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;

-- добавление состава заказа

go
create or alter procedure AddOrderComposition
    @p_order_id int,
    @p_product_id int,
    @p_quantity int
as
begin
	declare @p_composition_id int;
    select @p_composition_id = max(composition_id) from composition_of_orders;
	set @p_composition_id = isnull(@p_composition_id, 0) + 1;
    begin try
        begin transaction;
        insert into composition_of_orders (order_id, product_id, quantity, composition_id)
			values (@p_order_id, @p_product_id, @p_quantity, @p_composition_id);
        update products set quantity = quantity - @p_quantity where product_id = @p_product_id;
        commit;
    end try
    begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;

-- удаление состава заказа

go
create or alter procedure DeleteOrderComposition
    @p_order_id int
as
begin
    declare @p_quantity int;
    declare @p_product_id int;
    begin try
        begin transaction;
        select @p_quantity = quantity from composition_of_orders where order_id = @p_order_id;
		select @p_product_id = product_id from composition_of_orders where order_id = @p_order_id;
        update products set quantity = quantity + @p_quantity where product_id = @p_product_id;
        delete from composition_of_orders where order_id = @p_order_id;
        commit;
    end try
    begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;

-- оформление заказа со стороны пользовател€

go
create or alter procedure MakeOrder
    @p_product_name varchar(200),
    @p_quantity int,
	@p_customer_name varchar(200)
as
begin
    declare @p_order_id int;
    declare @p_customer_id int;
    declare @p_total_amount numeric(10, 2);
    declare @p_product_id int;
    declare @p_current_quantity int;
    select @p_current_quantity = quantity from products where product_name = @p_product_name;
    if (@p_quantity > @p_current_quantity)
    begin
        print ' оличество не может превышать имеющеес€';
        return;
    end;
    select @p_customer_id = customer_id from customers where name = @p_customer_name;
    select @p_total_amount = @p_quantity * price from products where product_name = @p_product_name;
    select @p_order_id = max(order_id) from orders;
    set @p_order_id = isnull(@p_order_id, 0) + 1;
    select @p_product_id = product_id from products where product_name = @p_product_name;
    begin try
        begin transaction;
        exec AddOrder @p_customer_id, @p_total_amount, 4;
        exec AddOrderComposition @p_order_id, @p_product_id, @p_quantity;
        commit;
    end try
    begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;

-- отмена заказа со стороны пользовател€

go
create or alter procedure UndoOrder
    @p_order_id int
as
begin
    begin try
        begin transaction;
        exec DeleteOrderComposition @p_order_id;
        exec DeleteOrder @p_order_id;
        commit;
    end try
	begin catch
        if @@trancount > 0
            rollback;
        throw;
    end catch;
end;