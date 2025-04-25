create database LEC;

drop table LifeEvents;
drop table Celebrities;

create table Celebrities (
    Id int primary key identity(1,1),
    FullName nvarchar(255) not null,
    Nationality char(2) not null,
    ReqPhotoPath nvarchar(255) null
);

create table LifeEvents (
    Id int primary key identity(1,1),
    CelebrityId int not null,
    Date datetime not null,
    Description nvarchar(500) not null,
    ReqPhotoPath nvarchar(255) null,
    foreign key (CelebrityId) references Celebrities(Id)
);

select * from Celebrities;
insert into Celebrities (FullName, Nationality, ReqPhotoPath) values
	('Noam Chomsky', 'USA', '/Photo/chomsky.jpg'),
	('Tim Berners-Lee', 'UK', '/Photo/berners-Lee.jpg'),
	('Edgar Codd', 'UK', '/Photo/codd.jpg'),
	('Donald Knuth', 'UK', '/Photo/knuth.jpg'),
	('Linus Torvalds', 'Finland', '/Photo/torvalds.jpg'),
	('John Neumann', 'Hungary', '/Photo/neumann.jpg'),
	('Edsger Dijkstra', 'Netherlands', '/Photo/dijkstra.jpg'),
	('Ершов Андрей Петрович', 'USSR', '/Photo/ershov.jpg'),
	('Andrew Tanenbaum', 'Netherlands', '/Photo/tanenbaum.jpg');

select * from LifeEvents;
insert into LifeEvents (CelebrityId, Date, Description, ReqPhotoPath) values 
	(1, '1928-12-07', 'Дата рождения', null),
	(1, '1955-01-01', 'Издание книги "Логистическая структура лингвистической теории"', null),
	(5, '1969-12-28', 'Дата рождения. Финляндия', null),
	(8, '1931-04-19', 'Даат рождения. Москва', null);

delete from LifeEvents;
delete from Celebrities;