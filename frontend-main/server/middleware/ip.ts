import { defineEventHandler, getHeader } from 'h3'

export default defineEventHandler((event) => {
  const forwardedFor = getHeader(event, 'x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() || event.node.req.socket?.remoteAddress
  console.log(ip)
  event.context.clientIP = ip
})