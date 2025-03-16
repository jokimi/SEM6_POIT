alter session set container = ORCLPDB1;
insert into kem.product_categories values (1, 'Pants');
insert into kem.product_categories values (2, 'Shirt');
insert into kem.product_categories values (3, 'T-shirt');
insert into kem.product_categories values (4, 'Skirt');
insert into kem.product_categories values (5, 'Jacket');
insert into kem.product_categories values (6, 'Sweater');
commit;

insert into kem.products values (1, 'Jeans', 1, 60, 'Classic blue jeans', 'https://example.com/images/jeans.jpg', 10);
insert into kem.products values (2, 'Polo shirt', 2, 30, 'White polo shirt (M)', 'https://example.com/images/polo-shirt.jpg', 20);
insert into kem.products values (3, 'T-shirt with logo', 3, 20, 'Black t-shirt with logo (F)', 'https://example.com/images/logo-tshirt.jpg', 15);
insert into kem.products values (4, 'Mini skirt', 4, 40, 'Faux leather mini skirt', 'https://example.com/images/mini-skirt.jpg', 5);
insert into kem.products values (5, 'Down jacket', 5, 100, 'Down jacket with a hood (F)', 'https://example.com/images/puffer-jacket.jpg', 8);
insert into kem.products values (6, 'Hooded sweatshirt', 6, 50, 'Grey hooded sweatshirt (M)', 'https://example.com/images/hoodie.jpg', 12);
insert into kem.products values (7, 'Sweatpants', 1, 50, 'Black sweatpants', 'https://example.com/images/sports-pants.jpg', 20);
insert into kem.products values (8, 'Jogger pants', 1, 40, 'Joggers with pockets (M)', 'https://example.com/images/jogger-pants.jpg', 15);
insert into kem.products values (9, 'Long sleeve shirt', 2, 35, 'Pink long sleeve shirt (F)', 'https://example.com/images/long-sleeve-shirt.jpg', 10);
insert into kem.products values (10, 'Short sleeve shirt', 2, 25, 'Blue short sleeve shirt (M)', 'https://example.com/images/short-sleeve-shirt.jpg', 18);
insert into kem.products values (11, 'T-shirt with print', 3, 15, 'White t-shirt with print (M)', 'https://example.com/images/print-tshirt.jpg', 25);
insert into kem.products values (12, 'Polo t-shirt', 3, 20, 'Short sleeve polo t-shirt (F)', 'https://example.com/images/polo-tshirt.jpg', 12);
insert into kem.products values (13, 'Checkered mini skirt', 4, 30, 'Black and red checkered mini skirt', 'https://example.com/images/checkered-skirt.jpg', 8);
insert into kem.products values (14, 'Maxi skirt', 4, 50, 'Floral Print Maxi Skirt', 'https://example.com/images/maxi-skirt.jpg', 5);
insert into kem.products values (15, 'Leather jacket', 5, 150, 'Leather jacket with zipper (M)', 'https://example.com/images/leather-jacket.jpg', 10);
insert into kem.products values (16, 'Windbreaker jacket', 5, 80, 'Windbreaker with a hood (F)', 'https://example.com/images/windbreaker-jacket.jpg', 15);
insert into kem.products values (17, 'Turtleneck sweater', 6, 40, 'Blue turtleneck sweater (M)', 'https://example.com/images/turtleneck-sweater.jpg', 20);
insert into kem.products values (18, 'Pocket sweater', 6, 30, 'Red pocket sweater (F)', 'https://example.com/images/pocket-sweater.jpg', 18);
commit;

insert into kem.customers values (1, 'jokimi', 'jokie@gmail.com', '+375445721239', 'Belarus, Minsk');
insert into kem.customers values (2, 'kenny', 'keikenny@mail.ru', '+141141141141', 'Ukraine, Vinnitsa');
insert into kem.customers values (3, 'SHOP_ADMIN', 'admin@gmail.com', '+375447777777', 'USA, Boston');
insert into kem.customers values (4, 'user1', 'user1@gmail.com', '+375446677777', 'Belarus, Minsk');
insert into kem.customers values (5, 'user2', 'user2@gmail.com', '+375445577777', 'Belarus, Minsk');
insert into kem.customers values (6, 'user3', 'user3@gmail.com', '+37544555555', 'Belarus, Minsk');
commit;

insert into kem.order_statuses values (1, 'Paid');
insert into kem.order_statuses values (2, 'Delivered');
insert into kem.order_statuses values (3, 'Cancelled');
insert into kem.order_statuses values (4, 'In processing');
commit;

insert into kem.orders values (1, 1, sysdate, 50, 2);
insert into kem.orders values (2, 2, sysdate, 30, 1);
insert into kem.orders values(6, 2, TO_DATE('2023-11-06', 'YYYY-MM-DD'), 50, 2);
insert into kem.orders values(7, 1, TO_DATE('2023-11-08', 'YYYY-MM-DD'), 40, 2);
commit;

insert into kem.composition_of_orders values (1, 8, 1, 1);
insert into kem.composition_of_orders values (1, 11, 1, 2);
insert into kem.composition_of_orders values (2, 13, 1, 3);
insert into kem.composition_of_orders values (6, 16, 1, 7);
insert into kem.composition_of_orders values (7, 5, 1, 8);
commit;

insert into kem.carts values (1, 1);
insert into kem.carts values (2, 2);
insert into kem.carts values (3, 3);
insert into kem.carts values (4, 4);
insert into kem.carts values (5, 5);
commit;

insert into kem.cart_items values (1, 1, 1, 1);
insert into kem.cart_items values (2, 2, 5, 2);
insert into kem.cart_items values (3, 2, 6, 1);
commit;

begin
    SalesByPeriod();
end;

begin
    DisplayPopularProducts();
end;

begin
    DisplayTotalAmountOfProducts();
end;
 
begin
    DisplayProductCategories();
end;

begin 
    DisplayOrderInformation();
end;
    
begin
    DisplayCustomerInformation();
end;

SELECT GetTotalOrderAmount(1) AS TotalAmount FROM dual;

INSERT INTO KEM.ORDERS (order_id, customer_id, order_date, total_amount, status_id)
    VALUES (OrderSeq.NEXTVAL, 1, SYSDATE, 10, 1);
SELECT * FROM KEM.ORDERS WHERE customer_id = 1;

update KEM.COMPOSITION_OF_ORDERS set quantity = 5 where order_id = 1 and product_id = 8;
SELECT * FROM KEM.ORDERS WHERE order_id = 1;
SELECT * FROM KEM.COMPOSITION_OF_ORDERS;