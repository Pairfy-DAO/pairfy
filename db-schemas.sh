#!/bin/sh

alias vtctldclient="vtctldclient --server=localhost:15999"
alias mysql="mysql -h 127.0.0.1 -P 15306 -u marketplace -ppassword"



vtctldclient ApplySchema --sql-file="service-seller/src/sql/seller.sql" service_seller
vtctldclient ApplyVSchema --vschema-file="service-seller/src/sql/seller.json" service_seller



vtctldclient ApplySchema --sql-file="service-product/src/sql/product.sql" service_product
vtctldclient ApplyVSchema --vschema-file="service-product/src/sql/product.json" service_product

