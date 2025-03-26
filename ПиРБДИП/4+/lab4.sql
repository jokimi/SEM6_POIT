create database lab4_db;
use lab4_db;

select schema_name from INFORMATION_SCHEMA.SCHEMATA;

-- 6. Определите тип пространственных данных во всех таблицах

select TABLE_NAME, COLUMN_NAME, DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = 'dbo';
--
-- 7. Определите SRID - идентификатор системы координат

select srid from dbo.geometry_columns;

-- 8. Определите атрибутивные столбцы

select TABLE_NAME, COLUMN_NAME, DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = 'dbo' and DATA_TYPE != 'geometry';

-- 9. Верните описания пространственных объектов в формате WKT

select geom.STAsText() as WKT_Description from polys;

-- 10.1. Нахождение пересечения пространственных объектов

select obj1.geom.STIntersection(obj2.geom) as Intersection from polys obj1, polys obj2
	where obj1.qgs_fid = 3 and obj2.qgs_fid = 3;

select obj1.geom.STIntersection(obj2.geom) as Intersection from polys obj1, polys obj2
	where obj1.qgs_fid = 29 and obj2.qgs_fid = 29;

select obj1.geom.STIntersection(obj2.geom) as Intersection from polys obj1, polys obj2
	where obj1.qgs_fid = 3 and obj2.qgs_fid = 29;

-- 10.2. Нахождение координат вершин пространственного объектов

select geom.STPointN(1).ToString() as Coordinates from polys where qgs_fid = 6;

-- 10.3. Нахождение площади пространственных объектов

select geom.STArea() as ObjectArea from polys where qgs_fid = 5;

-- 11.1. Создайте пространственный объект в виде точки

declare @pointGeometry geometry;
set @pointGeometry = geometry::STGeomFromText('POINT(25 25)', 4326);
select @pointGeometry as PointGeometry;

-- 11.2. Создайте пространственный объект в виде линии

declare @lineGeometry geometry;
set @lineGeometry = geometry::STGeomFromText('LINESTRING(20 5, 5 20, 25 25)', 4326);
select @lineGeometry as LineGeometry;

-- 11.3. Создайте пространственный объект в виде полигона

declare @polygonGeometry geometry;
set @polygonGeometry = geometry::STGeomFromText('POLYGON((15 10, 55 55, 5 4, 12 2, 15 10))', 4326);
select @polygonGeometry as PolygonGeometry;

-- 12. Найдите, в какие пространственные объекты попадают созданные вами объекты

declare @point geometry = geometry::STGeomFromText('POINT(25 25)', 4326);
select * from polys where geom.STContains(@point) = 1;

declare @line geometry = geometry::STGeomFromText('LINESTRING(25 -15, 25 -10, 26 -10)', 4326);
select * from polys where geom.STContains(@line) = 1;

declare @polygon geometry = geometry::STGeomFromText('POLYGON((25 -15, 25 -14, 26 -10, 25 -15))', 4326);
select * from polys where geom.STContains(@polygon) = 1;

-- 13. Продемонстрируйте индексирование пространственных объектов

create spatial index SIDX_Polys_SP on polys(geom) using GEOMETRY_GRID  
	with (BOUNDING_BOX = (25.00, -15.00, 26.00, -10.00));
drop index SIDX_Polys_SP on polys;

select * from sys.indexes where name = 'SIDX_Polys_SP';

select * from polys with(index(SIDX_Polys_SP)) where geom.STIntersects(geometry::STGeomFromText('POLYGON((25 -15, 25 -14, 26 -10, 25 -15))', 4326)) = 1;

-- 14. Разработайте хранимую процедуру, которая принимает координаты точки и возвращает пространственный объект, в который эта точка попадает

go
create procedure FindContainingPolygon
    @latitude float,
    @longitude float
as
begin
    declare @point geometry;
    set @point = geometry::STGeomFromText('POINT(' + cast(@longitude as varchar(20)) + ' ' + cast(@latitude as varchar(20)) + ')', 4326);
    select * from polys where geom.STContains(@point) = 1;
end;

exec FindContainingPolygon -8, -64;
exec FindContainingPolygon 22, 79;
exec FindContainingPolygon 62, 110;