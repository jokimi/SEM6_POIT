create database psca_lab14;

-- drop table FACULTY;
create table FACULTY (
	FACULTY nchar(10) not null,
	FACULTY_NAME nvarchar(50), 
	constraint PK_FACULTY primary key(FACULTY) 
);

delete from FACULTY;

insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('����', '����������� ���� � ����������');
insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('����', '���������� ���������� � �������');
insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('���', '����������������� ���������');
insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('���', '���������-������������� ���������');
insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('����', '���������� � ������� ������ ��������������');
insert into FACULTY (FACULTY, FACULTY_NAME)
    values ('���', '���������� ������������ �������');

------------------------------------------------------------------------------------------------------------------------

-- drop table PULPIT;
create table PULPIT (
	PULPIT nchar(10) not null,
	PULPIT_NAME nvarchar(100), 
	FACULTY nchar(10) not null, 
	constraint FK_PULPIT_FACULTY foreign key(FACULTY) references FACULTY(FACULTY) on delete cascade, 
	constraint PK_PULPIT primary key(PULPIT) 
); 

delete from PULPIT;

insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('����', '�������������� ������ � ���������� ', '����');
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('������', '���������������� ������������ � ������ ��������� ���������� ', '����');
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��', '�����������', '���');         
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��', '������������', '���');   
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��', '��������������', '���');           
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('�����', '���������� � ����������������', '���');                
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('������', '������������ �������������� � ������-��������� �������������','���');                  
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��', '���������� ����', '����');                        
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('�����', '������ ����� � ���������� �������������', '����');                        
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��', '������������ �����', '���');            
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��������','���������� ���������������� ������� � ����������� ���������� ����������','���');             
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('�������','���������� �������������� ������� � ����� ���������� ���������� ','����');                    
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('��������','�����, ���������� ����������������� ����������� � ���������� ����������� �������', '����');
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('����', '������������� ������ � ����������', '���');   
insert into PULPIT (PULPIT, PULPIT_NAME, FACULTY)
    values ('����', '����������� � ��������� ������������������', '���');    

------------------------------------------------------------------------------------------------------------------------

-- drop table TEACHER;
create table TEACHER ( 
	TEACHER nchar(10) not null,
	TEACHER_NAME nvarchar(50), 
	PULPIT nchar(10) not null, 
	constraint PK_TEACHER primary key(TEACHER), 
	constraint FK_TEACHER_PULPIT foreign key(PULPIT) references PULPIT(PULPIT) on delete cascade
);
 
delete from TEACHER;

insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������ �������� �������������', '����');
insert into TEACHER (TEACHER,  TEACHER_NAME, PULPIT)
    values ('�����', '�������� ��������� ��������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('�����', '���������� ������ ����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������ ���� �����������', '����');
insert into TEACHER (TEACHER,  TEACHER_NAME, PULPIT)
    values ('����', '������� �������� ��������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('�����', '�������� ������ ���������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '����� ��������� ����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '������� ��������� �����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '��������� ����� ��������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '��������� ������� ����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '����������� ������� ����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('?', '�����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '����� ������� ��������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '����� ������� �������������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '���������� ��������� �������������', '������');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('�����', '������� ������ ����������', '������');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '����������� ��������� ��������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������� ��������� ����������', '����');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������ ������ ��������', '��');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������� ������ ����������', '������');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '���������� �������� ��������', '��');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '������ ���������� ������������', '��');
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('�����', '��������� �������� ���������', '�����'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '���������� �������� ����������', '��'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('������', '��������� ������� ���������', '��������'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('�����', '�������� ������ ����������', '��'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('���', '����� ������ ��������', '�����'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������ ������� ���������', '�������'); 
insert into TEACHER (TEACHER, TEACHER_NAME, PULPIT)
    values ('����', '������� ���� ����������', '��������'); 

------------------------------------------------------------------------------------------------------------------------

-- drop table SUBJECT;
create table SUBJECT (
    SUBJECT nchar(10) not null, 
    SUBJECT_NAME nvarchar(50) not null,
    PULPIT nchar(10) not null,  
    constraint PK_SUBJECT primary key(SUBJECT),
    constraint FK_SUBJECT_PULPIT foreign key(PULPIT) references PULPIT(PULPIT) on delete cascade
);

delete from SUBJECT;

insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '������� ���������� ������ ������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '���� ������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '�������������� ����������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '������ �������������� � ����������������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '������������� ������ � ������������ ��������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '��������������� ������� ����������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '������������� ������ ��������� ����������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '�������������� �������������� ������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '������������ ��������� ', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('�����', '��������������� ������, �������� � �������� �����', '������');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '������������ �������������� �������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '����������� ���������������� ������������', '������');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '���������� ���������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '�������������� ����������������', '����');  
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '���������� ������ ���', '����');                   
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '��������-��������������� ����������������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '��������� ������������������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '������������� ������', '����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('������OO', '�������� ������ ������ � ���� � ���. ������.', '��');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('�������', '������ ��������������� � ������������� ���������', '������');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '���������� �������� ', '��');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '�����������', '�����');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('��', '������������ �����', '��');   
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '���������� ��������� �������', '��������'); 
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '������ ��������� ����', '��');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '���������� � ������������ �������������', '�����'); 
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('����', '���������� ���������� �������� ����������', '�������');
insert into SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
    values ('���', '���������� ������������', '��������');          

------------------------------------------------------------------------------------------------------------------------

-- drop table AUDITORIUM_TYPE 
create table AUDITORIUM_TYPE (
	AUDITORIUM_TYPE nchar(10) constraint AUDITORIUM_TYPE_PK primary key,  
	AUDITORIUM_TYPENAME nvarchar(30) constraint AUDITORIUM_TYPENAME_NOT_NULL not null         
);

delete from AUDITORIUM_TYPE;

insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
    values ('��', '����������');
insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
    values ('��-�', '������������ �����');
insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
    values ('��-�', '���������� � ���. ������������');
insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
    values ('��-X', '���������� �����������');
insert into AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
    values ('��-��', '����. ������������ �����');

------------------------------------------------------------------------------------------------------------------------

-- drop table AUDITORIUM 
create table AUDITORIUM (
	AUDITORIUM nchar(10) primary key,
	AUDITORIUM_NAME nvarchar(200),
	AUDITORIUM_CAPACITY integer,
	AUDITORIUM_TYPE nchar(10) not null references AUDITORIUM_TYPE(AUDITORIUM_TYPE) on delete cascade
);

delete from AUDITORIUM;

insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('206-1', '206-1', '��-�', 15);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('301-1', '301-1', '��-�', 15);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('236-1', '236-1', '��', 60);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('313-1', '313-1', '��', 60);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('324-1', '324-1', '��', 50);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('413-1', '413-1', '��-�', 15);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('423-1', '423-1', '��-�', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('408-2', '408-2', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('103-4', '103-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('105-4', '105-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('107-4', '107-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('110-4', '110-4', '��', 30);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('111-4', '111-4', '��', 30);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('114-4', '114-4', '��-�', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('132-4', '132-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('02�-4', '02�-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('229-4', '229-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('304-4', '304-4','��-�', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('314-4', '314-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('320-4', '320-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('429-4', '429-4', '��', 90);
insert into AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
    values ('?', '???', '��', 90);