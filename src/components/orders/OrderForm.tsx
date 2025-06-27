import React, { useState, useEffect } from 'react';
import { Order, OrderItem } from '../../api/orders';
import { fetchProducts, Product } from '../../api/products';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface OrderFormProps {
  onSubmit: (values: Partial<Order>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const paymentMethods = ['Cash', 'Credit Card', 'PayPal', 'Other'];

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: { street: '', city: '', state: '', zipCode: '', country: '' } });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts({ limit: 100 }).then(data => setProducts(data.products));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product: '', name: '', price: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof OrderItem, value: any) => {
    setItems(items.map((item, i) => {
      if (i !== idx) return item;
      if (field === 'product') {
        const prod = products.find(p => p._id === value);
        return prod ? { ...item, product: prod._id!, name: prod.name, price: prod.price } : item;
      }
      return { ...item, [field]: value };
    }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setCustomer({ ...customer, address: { ...customer.address, [name.replace('address.', '')]: value } });
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || items.length === 0 || items.some(i => !i.product || i.quantity < 1)) {
      setError('Please fill in all required fields and add at least one item.');
      return;
    }
    setError(null);
    onSubmit({ customer, items, paymentMethod });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="font-semibold">Customer Info</div>
      <Input name="name" label="Name" value={customer.name} onChange={handleCustomerChange} required />
      <Input name="email" label="Email" value={customer.email} onChange={handleCustomerChange} required type="email" />
      <Input name="phone" label="Phone" value={customer.phone} onChange={handleCustomerChange} />
      <Input name="address.street" label="Street" value={customer.address.street} onChange={handleCustomerChange} />
      <Input name="address.city" label="City" value={customer.address.city} onChange={handleCustomerChange} />
      <Input name="address.state" label="State" value={customer.address.state} onChange={handleCustomerChange} />
      <Input name="address.zipCode" label="Zip Code" value={customer.address.zipCode} onChange={handleCustomerChange} />
      <Input name="address.country" label="Country" value={customer.address.country} onChange={handleCustomerChange} />
      <div className="font-semibold mt-4">Order Items</div>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-2 mb-2">
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={item.product}
            onChange={e => handleItemChange(idx, 'product', e.target.value)}
            required
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} (${p.price})</option>
            ))}
          </select>
          <Input
            type="number"
            min={1}
            className="w-20"
            value={item.quantity}
            onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
            required
          />
          <Button type="button" variant="outline" onClick={() => handleRemoveItem(idx)} disabled={loading}>Remove</Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddItem} disabled={loading}>Add Item</Button>
      <div className="font-semibold mt-4">Payment Method</div>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        value={paymentMethod}
        onChange={e => setPaymentMethod(e.target.value)}
        required
      >
        {paymentMethods.map(method => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>Create Order</Button>
      </div>
    </form>
  );
};

export default OrderForm; 