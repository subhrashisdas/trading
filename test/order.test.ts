import { getOrders } from '@src/order';
import { ok } from 'assert';

export async function getOrdersTest() {
  const orders = await getOrders();
  ok(orders.length >= 0);
}
