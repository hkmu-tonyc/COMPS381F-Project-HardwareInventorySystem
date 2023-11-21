Computer Hardware Inventory Management System app

Group: 6
Name: 
Chau Man Chung (13202700)

Application link: https://s381f-computerhardwareinventorysystem.onrender.com

********************************************
# Login
There are a total of 3 users in this system.
Users can access the inventory management system by entering their own username and password at the login page.

Each user has its corresponding username and password;
[
	{username: tony-hkmu, password: s381f},
	{username: admin1, password: admin},
	{username: assistant, password: assistant}
]

The username will be stored in a session when logged in successfully.

********************************************
# Logout
Users can log out their own account by clicking logout at the menu page.

********************************************
# CRUD service
- Create
- A hardware document has the following attributes. For example: 
  1)	Product ID (58429348), product ID must be 8-digits.
  2)	Category (GPU)
  3)	Hardware Name (NVIDIA GeForce RTX 2060 Founders Edition)
  4)	Release Year (2019), release year must be 4-digits.
  5)	Price (2720), price must be a number.

All attributes in the hardware document are mandatory for completeness of the computer hardware information.

Create operation is post request, and all information of the hardware is in the body of request.

********************************************
# CRUD service
- Read
- There are four options to read and find hardware list all information or searching by product id, category and release year.

1) List all information
	hardware name will be displayed in list.ejs;
	clicking on a hardware name, the details of the hardware will be shown in display.ejs;

2) Searching by product ID
	input the product ID you want to find (58429348);
	after clicking the "search" button, user will be displayed with all hardware items associated with the product ID;

4) Searching by category
	input the category you want to find (GPU);
	after clicking the "search" button, user will be displayed with all hardware items associated with the category;

2) Searching by release year
	input the category you want to find (2021);
	after clicking the "search" button, user will be displayed with all hardware items released in the year;
********************************************
# CRUD service
- Update
- The user can update the hardware information through the details interface.

- A hardware document has the following attributes. For example: 
  1)	Product ID (58429349), product ID must be 8-digits.
  2)	Category (GPU)
  3)	Hardware Name (NVIDIA GeForce RTX 2060 Founders Edition)
  4)	Release Year (2019), release year must be 4-digits.
  5)	Price (2800), price must be a number.

In this example, the Product ID and the Price are updated.

********************************************
# CRUD service
- Delete
- The user can delete the information of a hardware by clicking "delete" in the details page.

********************************************
# Restful
In this project, there are three HTTP request types: post, put and delete.

- Post 
	Post request is used for create.
	Path URL: /api/inventories/:product_id
	Test: curl -X POST -H "Content-Type: application/json" --data '{"category":"GPU","hardware_name": "NVIDIA GeForce GTX 1080 TI Founders Edition", "release_year": "2017", "price": "3000", "product_id": "22221082"}' localhost:8099/api/inventories/22221082

- Put
	Get request is used for update.
	Path URL: /api/inventories/:product_id
	Test: curl -X PUT -H "Content-Type: application/json" --data '{"price":"5000", "release_year":"2018"}' localhost:8099/api/inventories/22221082

- Delete (Product ID)
	Delete request is used for deletion.
	Path URL: /api/inventories/:product_id
	Test: curl -X DELETE localhost:8099/api/inventories/22221081

- Delete (Year)
	Delete request is used for deletion.
	Path URL: /api/inventories/release_year/:release_year
	Test: curl -X DELETE localhost:8099/api/inventories/release_year/2016

curl -X POST -H "Content-Type: application/json" --data '{"category":"GPU","hardware_name": "NVIDIA GeForce GTX 1080 TI Founders Edition", "release_year": "2017", "price": "3000", "product_id": "22221082"}' localhost:8099/api/inventories/22221082

curl -X PUT -H "Content-Type: application/json" --data '{"price":"5000", "release_year":"2018"}' localhost:8099/api/inventories/22221082

curl -X DELETE localhost:8099/api/inventories/22221082

curl -X DELETE localhost:8099/api/inventories/release_year/2016
