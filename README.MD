This is very basic recommendation service demo which uses content based filtering algorithm.

The idea is:

Target asset A is selected with attributes a1, a2, a3

all other assets are checked and based on similarity of attributes a mattrix is created with dimensions as
attribute name as row and assets as column.

another matrix is target matrix having just one row and columns [a1, a2, a3]

Then we calculate dot product between both matrices.

That result is sorted and top 3 products are returned as suggestions.

This is albeit very naive algorithm and can be optimized further with taking hybrid with collaborative filtering

### How to run the project

1. Clone the repository
2. Build frontend
    a. cd client
    b. npm i
    c. npm run build
3. Run the server
    a. cd ..
    b. npm start
4. Visit localhost:3000 and it's on

### Database

Category Table
- name: string
- id: int

Asset Table
- asset_id: int
- title: string
- category: int (ref to category id)
- image_url: string
- pre_tax_return: float
- min_investment: int

# Create Database:
- create database recommender;

# Create DB user:

create user 'rec'@'localhost' IDENTIFIED BY 'recommend';

# Give permissions:

grant ALL on recommender.* TO 'rec'@'localhost';

# Recommended MySQL Server version: 5.*