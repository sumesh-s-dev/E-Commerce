import React, { useState } from 'react';
import { Product } from '../../api/products';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (values: Partial<Product>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const defaultValues: Partial<Product> = {
  name: '',
  description: '',
  sku: '',
  category: '',
  price: 0,
  costPrice: 0,
  stock: 0,
};

const ProductForm: React.FC<ProductFormProps> = ({ initialValues = {}, onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState<Partial<Product>>({ ...defaultValues, ...initialValues });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: name === 'price' || name === 'costPrice' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.sku || !values.category || !values.price || !values.costPrice || !values.stock) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Input name="name" label="Name" value={values.name} onChange={handleChange} required />
      <Input name="description" label="Description" value={values.description} onChange={handleChange} required as="textarea" />
      <Input name="sku" label="SKU" value={values.sku} onChange={handleChange} required />
      <Input name="category" label="Category" value={values.category} onChange={handleChange} required />
      <Input name="price" label="Price" type="number" value={values.price} onChange={handleChange} required min={0} />
      <Input name="costPrice" label="Cost Price" type="number" value={values.costPrice} onChange={handleChange} required min={0} />
      <Input name="stock" label="Stock" type="number" value={values.stock} onChange={handleChange} required min={0} />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{initialValues._id ? 'Update' : 'Create'} Product</Button>
      </div>
    </form>
  );
};

export default ProductForm; 