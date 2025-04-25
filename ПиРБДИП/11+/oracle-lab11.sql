grant create session to kem;
alter table kem.products add pr_date date;

update kem.products set pr_date = TO_DATE('12.12.2024', 'DD.MM.YYYY') where product_id = 1;
update kem.products set pr_date = TO_DATE('23.10.2023', 'DD.MM.YYYY') where product_id = 2;
update kem.products set pr_date = TO_DATE('01.05.2025', 'DD.MM.YYYY') where product_id = 3;
update kem.products set pr_date = TO_DATE('15.09.2025', 'DD.MM.YYYY') where product_id = 4;
update kem.products set pr_date = TO_DATE('01.01.2025', 'DD.MM.YYYY') where product_id = 5;
update kem.products set pr_date = TO_DATE('19.04.2024', 'DD.MM.YYYY') where product_id = 6;
update kem.products set pr_date = TO_DATE('31.12.2024', 'DD.MM.YYYY') where product_id = 7;
update kem.products set pr_date = TO_DATE('11.11.2023', 'DD.MM.YYYY') where product_id = 8;
update kem.products set pr_date = TO_DATE('08.03.2024', 'DD.MM.YYYY') where product_id = 9;
update kem.products set pr_date = TO_DATE('06.07.2024', 'DD.MM.YYYY') where product_id = 10;
update kem.products set pr_date = TO_DATE('07.08.2023', 'DD.MM.YYYY') where product_id = 11;
update kem.products set pr_date = TO_DATE('17.10.2024', 'DD.MM.YYYY') where product_id = 12;
update kem.products set pr_date = TO_DATE('30.12.2022', 'DD.MM.YYYY') where product_id = 13;
update kem.products set pr_date = TO_DATE('02.02.2024', 'DD.MM.YYYY') where product_id = 14;
update kem.products set pr_date = TO_DATE('03.06.2025', 'DD.MM.YYYY') where product_id = 15;
update kem.products set pr_date = TO_DATE('09.05.2024', 'DD.MM.YYYY') where product_id = 16;
update kem.products set pr_date = TO_DATE('01.09.2024', 'DD.MM.YYYY') where product_id = 17;
update kem.products set pr_date = TO_DATE('29.04.2024', 'DD.MM.YYYY') where product_id = 18;

create or replace function getData(start_date in date, end_date in date)
return sys_refcursor
is
    result_cursor sys_refcursor;
begin
    open result_cursor for
        select * from kem.products where pr_date between start_date and end_date;
    return result_cursor;
end;

create or replace function getDataOrders(start_date in date, end_date in date)
return sys_refcursor
is
    result_cursor sys_refcursor;
begin
    open result_cursor for
        select * from kem.orders where order_date between start_date and end_date;
    return result_cursor;
end;

set serveroutput on;
set verify off;
set pagesize 0;
set linesize 1000;

var result_cursor refcursor;
exec :result_cursor := getData(to_date('01.01.2024', 'DD.MM.YYYY'), to_date('31.12.2024', 'DD.MM.YYYY'));
spool files/output_oracle_products.txt;
print result_cursor;
spool off;

select * from kem.products;
delete from kem.products where product_id > 18;

var result_cursor refcursor;
exec :result_cursor := getDataOrders(to_date('01.01.2024', 'DD.MM.YYYY'), to_date('31.12.2024', 'DD.MM.YYYY'));
spool files/output_oracle_orders.txt;
print result_cursor;
spool off;