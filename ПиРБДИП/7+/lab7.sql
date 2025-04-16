select * from kem.products;
select * from kem.orders;
select * from kem.customers;

begin
    kem.DisplayOrderInformation;
end;

begin
    MakeOrder('Windbreaker jacket', 1, 'user1');
end;

-- 1. План продаж для каждого товара на следующий год, увеличивая продажи 0.5% каждый месяц от предыдущего

with sales_data as (
    select co.product_id, extract(month from o.order_date) as order_month, sum(co.quantity) as total_quantity
        from kem.COMPOSITION_OF_ORDERS co
        join kem.ORDERS o on co.order_id = o.order_id
        where extract(year from o.order_date) = extract(year from CURRENT_DATE)
        group by co.product_id, extract(month from o.order_date)
)
select product_id, order_month, total_quantity, round(sales_plan, 2) as sales_plan
    from sales_data
    model
        dimension by (product_id, order_month)
        measures (total_quantity, order_month AS om_copy, 0 AS sales_plan)
        rules (
            sales_plan[any, any] = total_quantity[CV(), CV()] * power(1.005, om_copy[CV(), CV()] - 1)
        )
    order by product_id, order_month;
    
-- 2. Рост, падение, рост стоимости заказа для каждого покупателя

select * from kem.ORDERS
    match_recognize (
        partition by customer_id
        order by order_date
        measures
            A.order_id as start_order_id,
            B.order_id as dip_order_id,
            C.order_id as end_order_id,
            A.total_amount as start_amount,
            B.total_amount as dip_amount,
            C.total_amount as end_amount
        one row per match
        pattern (A B C)
        define
            B as B.total_amount < A.total_amount,
            C as C.total_amount > B.total_amount
    );