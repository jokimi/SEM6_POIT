-- 1. �������� ��������� ��������� ������������ ��� �������� LOB.

create tablespace lob_ts
    datafile 'lob_ts.dbf'
    size 100m
    autoextend on;
drop tablespace lob_ts including contents and datafiles;

-- 2. �������� ��������� ����� ��� �������� ������� WORD (��� PDF) ����������.

create directory LOBDIR as '/opt/oracle/LOBDIR';

-- 3. �������� ������������ lob_user � ������������ ������������ ��� �������, ���������� � �������� ������� ��������.

create user lob_user identified by 1111;

grant create session to lob_user;
grant connect, resource to lob_user;
grant unlimited tablespace to lob_user;
grant create any directory to lob_user;
grant execute on utl_file to lob_user;

-- 4. �������� ����� �� ������ ��������� ������������ ������������ lob_user.

alter user lob_user quota unlimited on lob_ts;

-- 5. �������� � �����-���� ������� �������: FOTO (BLOB): ��� �������� ����������; DOC (BFILE): ��� �������� ������� WORD ����������.

create table lab10_table (
    id number primary key,
    photo blob,
    doc bfile
);
drop table lab10_table;

-- 6. �������� (INSERT) ���������� � ��������� � �������.

select * from lab10_table;
delete from lab10_table;
insert into lab10_table (id, photo, doc) values (1, bfilename('LOBDIR', 'cat.jpg'), bfilename('LOBDIR', 'text.doc'));
