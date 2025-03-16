use CHAIN_STORES;

-- добавление столбца иерархического типа
alter table PRODUCT_CATEGORIES add category_path hierarchyid;

select * from PRODUCT_CATEGORIES;

update PRODUCT_CATEGORIES set category_path = '/' WHERE category_id = 10;
update PRODUCT_CATEGORIES set category_path = '/1/' WHERE category_id = 1;
update PRODUCT_CATEGORIES set category_path = '/2/' WHERE category_id = 2;
update PRODUCT_CATEGORIES set category_path = '/3/' WHERE category_id = 3;
update PRODUCT_CATEGORIES set category_path = '/4/' WHERE category_id = 4;
update PRODUCT_CATEGORIES set category_path = '/5/' WHERE category_id = 5;
update PRODUCT_CATEGORIES set category_path = '/6/' WHERE category_id = 6;
update PRODUCT_CATEGORIES set category_path = '/7/' WHERE category_id = 7;

-- создание процедуры, которая отображает все подчинённые узлы с указанием уровня иерархии
go
create or alter procedure GetChildNodes
	@nodeId hierarchyid
as
begin
    select category_id, category_name, category_path.ToString() as category_path
		from PRODUCT_CATEGORIES
		where category_path.IsDescendantOf(@nodeId) = 1
		order by category_path
end

exec GetChildNodes @nodeId = '/';

-- создание процедуры, которая добавляет подчинённый узел
go
create or alter procedure AddChildNode
	@parent_category nvarchar(50),
	@new_category nvarchar(50)
as 
begin  
    declare @parent_path hierarchyid;
    declare @new_id int;
    set @new_id = (select max(category_id) from product_categories) + 1; 
    select @parent_path = category_path from PRODUCT_CATEGORIES where category_name = @parent_category;
    declare @last_child hierarchyid;
    select @last_child = max(category_path) from PRODUCT_CATEGORIES where category_path.GetAncestor(1) = @parent_path;
    insert into PRODUCT_CATEGORIES (category_id, category_name, category_path)  
		select @new_id, @new_category, @parent_path.GetDescendant(@last_child, null);
end;

exec AddChildNode @parent_category = 'Футболка', @new_category = 'Футболка 1';
exec AddChildNode @parent_category = 'Футболка 1', @new_category = 'Футболка 1-1';
exec AddChildNode @parent_category = 'Поло', @new_category = 'Поло 1';

-- создание процедуры, которая переместит все подчинённые узлы
go
create or alter procedure MoveNodes
	@oldMgr nvarchar(256),
	@newMgr nvarchar(256)
as
begin
    declare @nold hierarchyid, @nnew hierarchyid;
    select @nold = category_path from PRODUCT_CATEGORIES where category_name = @oldMgr;
    set transaction isolation level serializable;
    begin transaction;
    select @nnew = category_path from PRODUCT_CATEGORIES where category_name = @newMgr;
    select @nnew = @nnew.GetDescendant(max(category_path), null) from PRODUCT_CATEGORIES
		where category_path.GetAncestor(1) = @nnew;
    update PRODUCT_CATEGORIES set category_path = category_path.GetReparentedValue(@nold, @nnew)
		where category_path.IsDescendantOf(@nold) = 1;
    commit transaction;
end;

exec MoveNodes @oldMgr = 'Рубашка', @newMgr = 'Футболка';