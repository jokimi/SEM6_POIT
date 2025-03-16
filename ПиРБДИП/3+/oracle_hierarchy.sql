alter session set container = ORCLPDB1;

select * from kem.product_categories;

-- добавление столбца для иерархии

alter table kem.product_categories add pid int;

update kem.product_categories set pid = null where category_id = 7;
update kem.product_categories set pid = '7' where category_id = 1;
update kem.product_categories set pid = '7' where category_id = 2;
update kem.product_categories set pid = '7' where category_id = 3;
update kem.product_categories set pid = '7' where category_id = 4;
update kem.product_categories set pid = '7' where category_id = 5;
update kem.product_categories set pid = '7' where category_id = 6;

-- добавление процедуры для вывода иерархии

CREATE OR REPLACE PROCEDURE GetChildCategories (
    p_parent_category_name IN VARCHAR2
) AS
    p_parent_category_id INT;
BEGIN
    BEGIN
        SELECT category_id INTO p_parent_category_id 
            FROM kem.product_categories 
            WHERE category_name = p_parent_category_name;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Category "' || p_parent_category_name || '" not found.');
            RETURN;
    END;
    FOR rec IN (
        SELECT category_id, pid, category_name, LEVEL 
            FROM kem.product_categories
            START WITH category_id = p_parent_category_id
            CONNECT BY PRIOR category_id = pid
    )
    LOOP
        DBMS_OUTPUT.PUT_LINE(RPAD(' ', rec.level * 2, ' ') || '- ' ||
            rec.category_name || ' (ID: ' || rec.category_id || ', Parent ID: ' || rec.pid || ')');
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;

begin
    GetChildCategories('Items');
end;
begin
    GetChildCategories('Skirt');
end;

-- добавление процедуры для добавления узла

CREATE OR REPLACE PROCEDURE AddCategoryNode (
    p_parent_category_name IN VARCHAR2,
    p_new_category_name IN VARCHAR2
) AS
    p_parent_category_id INT;
    p_new_category_id INT;
BEGIN
    BEGIN
        SELECT category_id INTO p_parent_category_id FROM kem.product_categories
            WHERE category_name = p_parent_category_name;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Parent category "' || p_parent_category_name || '" not found.');
            RETURN;
    END;
    SELECT COALESCE(MAX(category_id), 0) + 1 INTO p_new_category_id FROM kem.product_categories;
    INSERT INTO kem.product_categories (category_id, category_name, pid)
        VALUES (p_new_category_id, p_new_category_name, p_parent_category_id);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('New category "' || p_new_category_name || '" added as a child of "' || p_parent_category_name || '".');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;

begin
    AddCategoryNode('Pants', 'Shorts');
end;
begin
    AddCategoryNode('Skirt', 'Short skirt');
end;

-- добавление процедуры для переноса всех подчинённых узлов

CREATE OR REPLACE PROCEDURE MoveChildCategories (
    p_old_parent_category_name IN VARCHAR2,
    p_new_parent_category_name IN VARCHAR2
) AS
    p_old_parent_category_id INT;
    p_new_parent_category_id INT;
BEGIN
    BEGIN
        SELECT category_id INTO p_old_parent_category_id FROM kem.product_categories
        WHERE category_name = p_old_parent_category_name;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Category "' || p_old_parent_category_name || '" not found.');
            RETURN;
    END;
    BEGIN
        SELECT category_id INTO p_new_parent_category_id FROM kem.product_categories
        WHERE category_name = p_new_parent_category_name;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Category "' || p_new_parent_category_name || '" not found.');
            RETURN;
    END;
    FOR rec IN (
        SELECT category_id FROM kem.product_categories
        START WITH category_id = p_new_parent_category_id
        CONNECT BY PRIOR pid = category_id
    ) LOOP
        IF rec.category_id = p_old_parent_category_id THEN
            DBMS_OUTPUT.PUT_LINE('Error: Cannot move categories because "' || p_new_parent_category_name || '" is a subcategory of "' || p_old_parent_category_name || '".');
            RETURN;
        END IF;
    END LOOP;
    UPDATE kem.product_categories SET pid = p_new_parent_category_id
        WHERE pid = p_old_parent_category_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Child categories moved from "' || p_old_parent_category_name || '" to "' || p_new_parent_category_name || '".');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;

begin
    MoveChildCategories('Skirt', 'Pants');
end;

select * from kem.product_categories;