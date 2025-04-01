select * from kem.products;
select * from kem.orders;
select * from kem.customers;

begin
    kem.DisplayOrderInformation;
end;

begin
    MakeOrder('Down jacket', 1, 'jokimi');
end;

-- 3. Вычисление количества заказов помесячно, за квартал, за полгода, за год

select distinct
    extract(year from order_date) as year,
    to_char(order_date, 'Q') as quarter,
    to_char(order_date, 'MM') as month,
    count(*) over (partition by extract(year from order_date), to_char(order_date, 'Q')) as orders_per_quarter,
    count(*) over (partition by extract(year from order_date), to_char(order_date, 'MM')) as orders_per_month,
    count(*) over (partition by extract(year from order_date)) as orders_per_year,
    count(*) over (partition by extract(year from order_date),
        case
            when extract(month from order_date) <= 6 then 1
            else 2
        end) as orders_per_half_year
from kem.ORDERS order by year, quarter, month;
    
-- 4. Вычисление итогов продаж за каждый год помесячно: количество заказов, сравнение их с общим количеством в %, сравнение с лучшим месяцем в %

select
    extract(year from order_date) as year,
    extract(month from order_date) as month,
    count(*) as orders_count,
    to_char(count(*) * 100.0 / sum(count(*)) over (partition by extract(year from order_date)), 'FM999.99') as percentage_of_total,
    to_char(count(*) * 100.0 / max(count(*)) over (partition by extract(year from order_date)), 'FM999.99') as percentage_of_max
from kem.ORDERS
group by
    extract(year from order_date),
    extract(month from order_date)
order by year, month;
    
-- 5. Вывод суммы последних 3 заказов для каждого клиента

select customer_id, sum(total_amount) as total_amount_last_3_orders
from (
    select order_id, customer_id, order_date, total_amount, row_number() over (partition by customer_id order by order_date desc) as row_num
    from kem.ORDERS
) ordered_orders
where row_num <= 3
group by customer_id;
    
-- 6. Вывод для каждого покупателя товара, который он чаще всего покупает

with ordered_products as (
    select c.name as customer_name, p.product_name, count(*) as purchase_count, row_number() over (partition by c.customer_id order by count(*) desc) as row_num
    from kem.ORDERS o
        join kem.CUSTOMERS c on o.customer_id = c.customer_id
        join kem.COMPOSITION_OF_ORDERS co on o.order_id = co.order_id
        join kem.PRODUCTS p on co.product_id = p.product_id
        group by c.customer_id, c.name, p.product_id, p.product_name
)
select customer_name, product_name, purchase_count from ordered_products where row_num = 1;