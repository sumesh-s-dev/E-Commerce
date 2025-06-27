import React from 'react';
import { Order } from '../../api/orders';
import Button from '../ui/Button';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusChange?: (status: string) => void;
  statusLoading?: boolean;
}

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onStatusChange, statusLoading }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Order Details</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
      <div>
        <div className="font-semibold">Order #:</div>
        <div>{order.orderNumber || order._id}</div>
      </div>
      <div>
        <div className="font-semibold">Customer:</div>
        <div>{order.customer.name} ({order.customer.email})</div>
        {order.customer.phone && <div>{order.customer.phone}</div>}
        {order.customer.address && (
          <div>
            {order.customer.address.street && <div>{order.customer.address.street}</div>}
            {order.customer.address.city && <span>{order.customer.address.city}, </span>}
            {order.customer.address.state && <span>{order.customer.address.state} </span>}
            {order.customer.address.zipCode && <span>{order.customer.address.zipCode}, </span>}
            {order.customer.address.country && <span>{order.customer.address.country}</span>}
          </div>
        )}
      </div>
      <div>
        <div className="font-semibold">Status:</div>
        {onStatusChange ? (
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={order.status}
            onChange={e => onStatusChange(e.target.value)}
            disabled={statusLoading}
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <div>{order.status}</div>
        )}
      </div>
      <div>
        <div className="font-semibold">Payment:</div>
        <div>Method: {order.paymentMethod}</div>
        <div>Status: {order.paymentStatus}</div>
      </div>
      <div>
        <div className="font-semibold">Order Items:</div>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1">{item.name}</td>
                <td className="px-2 py-1">${item.price.toFixed(2)}</td>
                <td className="px-2 py-1">{item.quantity}</td>
                <td className="px-2 py-1">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="font-semibold">Subtotal:</div>
        <div>${order.subtotal.toFixed(2)}</div>
        <div className="font-semibold">Tax:</div>
        <div>${order.tax?.toFixed(2) ?? '0.00'}</div>
        <div className="font-semibold">Total:</div>
        <div>${order.total.toFixed(2)}</div>
      </div>
      {order.notes && (
        <div>
          <div className="font-semibold">Notes:</div>
          <div>{order.notes}</div>
        </div>
      )}
      <div className="text-xs text-gray-500">
        Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}<br />
        Updated: {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : ''}
      </div>
    </div>
  );
};

export default OrderDetails; 