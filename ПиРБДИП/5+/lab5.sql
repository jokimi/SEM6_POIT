use CHAIN_STORES;

select * from products;
select * from orders;
select * from customers;

exec DisplayOrderInformation;

exec MakeOrder 'Куртка ветровка', 1, 'user2';

-- 3. Вывод количества заказов за месяц, за квартал, за полгода, за год

select distinct
    datepart(year, order_date) as year,
    datepart(quarter, order_date) as quarter,
    datepart(month, order_date) as month,
    count(*) over (partition by datepart(year, order_date), datepart(quarter, order_date)) as orders_per_quarter,
    count(*) over (partition by datepart(year, order_date), datepart(month, order_date)) as orders_per_month,
    count(*) over (partition by datepart(year, order_date)) as orders_per_year,
    count(*) over (partition by datepart(year, order_date),
		case
			when datepart(month, order_date) <= 6 then 1
			else 2
		end
	) as orders_per_half_year
from orders order by year, quarter, month;

-- 4. Вывод итогов продаж за каждый год помесячно: количество заказов, сравнение их с общим количеством в %, сравнение с лучшим месяцем в %

select
    datepart(year, order_date) as year,
    datepart(month, order_date) as month,
    count(*) as orders_count,
    format(count(*) * 100.0 / sum(count(*)) over (partition by datepart(year, order_date)), 'n2') as percentage_of_total,
    format(count(*) * 100.0 / max(count(*)) over (partition by datepart(year, order_date)), 'n2') as percentage_of_max
from orders group by datepart(year, order_date), datepart(month, order_date)
order by year, month;

-- 5. Разбиение результатов запроса на страницы по 20 строк на каждую страницу с помощью функции ранжирования ROW_NUMBER()

declare @PageNumber int = 1;
declare @PageSize int = 20;
select * from (
    select product_id, product_name, category_id, price, description, image_url, quantity, row_number() over (order by product_id) as row_num
    from products
) as subquery where row_num between (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize;

-- 6. Удаление дубликатов с помощью функции ранжирования ROW_NUMBER()

insert into products values (25, 'Кофта с карманами', 6, 30, 'Женская кофта с карманами', 'https://example.com/images/pocket-sweater.jpg', 18);
insert into products values (26, 'Кофта с карманами', 6, 30, 'Женская кофта с карманами', 'https://example.com/images/pocket-sweater.jpg', 18);
insert into products values (27, 'Футболка с логотипом', 3, 20, 'Женская футболка черного цвета с логотипом', 'https://example.com/images/logo-tshirt.jpg', 14);
select * from products;

with cte as (
    select *, row_number() over (partition by product_name order by product_id) as row_num from products
) delete from cte where row_num > 1;

-- 7. Вернуть для каждого клиента суммы последних 3 заказов

select customer_id, sum(total_amount) as total_amount_last_3_orders
from (
	select order_id, customer_id, order_date, total_amount, row_number()
		over (partition by customer_id order by order_date desc) as row_num
        from orders
) as ordered_orders
where row_num <= 3
group by customer_id;

-- 8. Вывести для каждого покупателя товар, который он чаще всего покупает

with ordered_products as (
    select c.name as customer_name, p.product_name, count(*) as purchase_count,
        row_number() over (partition by c.customer_id order by count(*) desc) as row_num
    from orders o
		join customers c on o.customer_id = c.customer_id
		join composition_of_orders co on o.order_id = co.order_id
		join products p on co.product_id = p.product_id
    group by c.customer_id, c.name, p.product_id, p.product_name
) select customer_name, product_name, purchase_count from ordered_products where row_num = 1;