select * from kem.customers;

-- 1. Создайте таблицу Report, содержащую два столбца – id и XML-столбец.

create table report (
    id number primary key,
    xmldata xmltype
);

-- 2. Создайте процедуру генерации XML. XML должен включать данные из как минимум 3 соединенных таблиц, различные промежуточные итоги и штамп времени.

create or replace procedure GenerateXML as
    xmldata xmltype;
begin
    select 
        xmlelement("data",
            (
                select xmlagg(
                    xmlelement("product", 
                        xmlforest(p.product_id as "product_id", p.product_name as "product_name", p.price as "price")
                    ) order by p.product_id
                ) from kem.products p
            ),
            (
                select xmlagg(
                    xmlelement("order", 
                        xmlforest(o.order_id as "order_id", o.order_date as "order_date"),
                        xmlelement("products",
                            (
                                select xmlagg(
                                    xmlelement("product_name", p.product_name)
                                )
                                from kem.composition_of_orders co join kem.products p on co.product_id = p.product_id 
                                where co.order_id = o.order_id
                            )
                        ),
                        xmlelement("total_cost",
                            (
                                select sum(co.quantity * p.price) from kem.composition_of_orders co 
                                join kem.products p on co.product_id = p.product_id 
                                where co.order_id = o.order_id
                            )
                        )
                    )
                ) from kem.orders o
            ),
            (
                select xmlagg(
                    xmlelement("customer", 
                        xmlforest(c.customer_id as "customer_id", c.name as "name")
                    )
                ) from kem.customers c
            ),
            xmlelement("generated_at", SYSTIMESTAMP)
        ) into xmldata from dual;
    insert into report (id, xmldata) values ((select NVL(max(id), 0) + 1 from report), xmldata);
    commit;
    dbms_output.put_line('XML generated and inserted into Report table.');
end;

exec GenerateXML;

select * from report;
delete from report;

-- 4. Создайте индекс над XML-столбцом в таблице Report.

create index ix_report_xmldata on report(xmldata) indextype is xdb.xmlindex;
drop index ix_report_xmldata;

select * from report where exists (
    select 1 from XMLTable('/data/product' passing xmlData columns product_id number path 'product_id')
        where product_id = 1
);

-- 5. Создайте процедуру извлечения значений элементов и/или атрибутов из XML-столбца в таблице Report (параметр – значение атрибута или элемента).

create or replace procedure extractxmlvalue (
    attributename in nvarchar2,
    extractedvalues out sys_refcursor
)
as
    sqlstatement nvarchar2(1000);
begin
    sqlstatement := 'select x.ExtractedValue from report, XMLTABLE(''/data/*'' passing xmlData
        columns ExtractedValue nvarchar2(100) path ''' || attributename || ''') x';
    open extractedvalues for sqlstatement;
end;

declare
    extractedvaluescursor sys_refcursor;
    extractedvalue nvarchar2(100);
begin
    extractxmlvalue(attributename => 'product_name', extractedvalues => extractedvaluescursor);
    loop
        fetch extractedvaluescursor into extractedvalue;
        exit when extractedvaluescursor%notfound;
        dbms_output.put_line(extractedvalue);
    end loop;
    close extractedvaluescursor;
end;