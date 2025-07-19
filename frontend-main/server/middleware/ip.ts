import { defineEventHandler, getHeader } from 'h3'

export default defineEventHandler((event) => {
  const ip =
    getHeader(event, 'cf-connecting-ip') ||
    getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    event.node.req.socket?.remoteAddress ||
    '0.0.0.0'


  console.log(getHeader(event, 'cf-connecting-ip'))
  console.log(getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim())
  console.log(event.node.req.socket?.remoteAddress)
  
  event.context.clientIP = ip
})