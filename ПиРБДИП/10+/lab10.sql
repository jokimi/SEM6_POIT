-- 1. Создайте отдельное табличное пространство для хранения LOB.

create tablespace lob_ts
    datafile 'lob_ts.dbf'
    size 100m
    autoextend on;
drop tablespace lob_ts including contents and datafiles;

-- 2. Создайте отдельную папку для хранения внешних WORD (или PDF) документов.

create directory LOBDIR as '/opt/oracle/LOBDIR';

-- 3. Создайте пользователя lob_user с необходимыми привилегиями для вставки, обновления и удаления больших объектов.

create user lob_user identified by 1111;

grant create session to lob_user;
grant connect, resource to lob_user;
grant unlimited tablespace to lob_user;
grant create any directory to lob_user;
grant execute on utl_file to lob_user;

-- 4. Добавьте квоту на данное табличное пространство пользователю lob_user.

alter user lob_user quota unlimited on lob_ts;

-- 5. Добавьте в какую-либо таблицу столбцы: FOTO (BLOB): для хранения фотографии; DOC (BFILE): для хранения внешних WORD документов.

create table lab10_table (
    id number primary key,
    photo blob,
    doc bfile
);
drop table lab10_table;

-- 6. Добавьте (INSERT) фотографии и документы в таблицу.

select * from lab10_table;
delete from lab10_table;
insert into lab10_table (id, photo, doc) values (1, bfilename('LOBDIR', 'cat.jpg'), bfilename('LOBDIR', 'text.doc'));
