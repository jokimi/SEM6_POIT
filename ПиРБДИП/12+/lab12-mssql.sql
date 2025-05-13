
-- 1. Создайте таблицу Report, содержащую два столбца – id и XML-столбец.

create table Report (
    id int primary key,
    xmlData xml
);

-- 2. Создайте процедуру генерации XML. XML должен включать данные из как минимум 3 соединенных таблиц, различные промежуточные итоги и штамп времени.

go
create or alter procedure GenerateXML
as
begin
    declare @xmlData xml;
    set @xmlData = (
        select
            (select p.product_id, p.product_name, p.price from products p for xml path('products'), type),
            (select o.order_id, o.order_date,
                (select p.product_name 
					from composition_of_orders co join products p on co.product_id = p.product_id 
					where co.order_id = o.order_id 
					for xml path('product_name'), type
				) as products,
                (select sum(co.quantity * p.price)
					from composition_of_orders co join products p on co.product_id = p.product_id 
					where co.order_id = o.order_id
				) as total_cost
				from orders o
				group by o.order_id, o.order_date
				for xml path('orders'), type
			),
            (select c.customer_id, c.name from customers c for xml path('customers'), type),
            getdate() as timestamp
			for xml path('data'), type
    );
    select @xmlData as GeneratedXML;
end;

exec GenerateXML;

-- 3. Создайте процедуру вставки этого XML в таблицу Report.

go
create or alter procedure InsertXMLIntoReport
as
begin
	declare @xmlData xml;
	declare @newId int;
	if ((select count(*) from Report) > 0)
		begin
			set @newId = (select max(id) from Report) + 1;
		end
	else
		begin
			set @newId = 1;
		end
	create table #TempXML (GeneratedXML xml);
	insert into #TempXML (GeneratedXML)
    exec GenerateXML;
	set @xmlData = (select GeneratedXML from #TempXML);
    insert into Report (id, xmlData) values (@newId, @xmlData);
	drop table #TempXML;
end;

exec InsertXMLIntoReport;

select * from Report;
delete from Report;

-- 4. Создайте индекс над XML-столбцом в таблице Report.

create primary xml index IX_Report_xmlData on Report(xmlData);
drop index IX_Report_xmlData on Report;

select * from Report where xmlData.exist('/data/products[product_id="1"]') = 1;

-- 5. Создайте процедуру извлечения значений элементов и/или атрибутов из XML -столбца в таблице Report (параметр – значение атрибута или элемента).

go
create or alter procedure GetInfoColumnData
    @XPath nvarchar(max)
as
begin
    set nocount on;
    declare @SQL nvarchar(max)
    set @SQL = 'select xmlData.query(''/data/products/' + @XPath + ''') as [xmlData] from Report for XML AUTO, TYPE';
    exec sp_executesql @SQL;
end;

exec GetInfoColumnData 'product_name';

select xmlData.query('for $product in (/data/products) return $product') as Result from Report
	where xmlData.exist('/data/products') = 1;