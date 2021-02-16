import { ApiCalls } from './lib/apiCalls'

console.log('Getting orders')

const api = new ApiCalls()

async function main () {
  const order = await getOrder(100)
  console.log(order)
}

async function getOrder (orderId) {
  return await api.getOrder(orderId)
}

main()
