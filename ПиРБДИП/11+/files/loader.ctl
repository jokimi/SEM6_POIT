LOAD DATA
INFILE 'D:\BSTU\6 sem\ПиРБДИП\Лабы\11\files\input_oracle.txt'
APPEND INTO TABLE kem.products
FIELDS TERMINATED BY ","
(
  	product_id,
  	product_name "UPPER(:product_name)",
	category_id,
  	price DECIMAL EXTERNAL "ROUND(:price, 1)",
  	description "UPPER(:description)",
  	image_url "UPPER(:image_url)",
  	quantity DECIMAL EXTERNAL "ROUND(:quantity, 1)",
  	pr_date DATE "DD.MM.YYYY"
)