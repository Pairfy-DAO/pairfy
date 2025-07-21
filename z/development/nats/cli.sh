# https://github.com/nats-io/natscli/releases

nats context add local --server http://localhost:4222

nats context select local

nats stream ls

nats stream delete service-media
nats stream delete service-processor
nats stream delete service-seller
nats stream delete service-product
nats stream delete service-gateway

#//////////////////////////////////////////////////////////////////////////////////////////

nats consumer ls product

nats consumer info product service-gateway-consumer

nats consumer delete product service-gateway-consumer

