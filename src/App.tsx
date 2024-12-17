import React, { useEffect, useState } from 'react';
import { products } from './utils/products';
import { parseProducts } from '@/utils/parseProducts';
import Table from './components/Table';

interface Product {
  ProductID: string;
  Name: string;
  Category: string;
  Price: string;
  Stock: string;
  Rating: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setData(parseProducts(products as any) as any);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="App">
      <h1>Product Dashboard</h1>
      {/* Table or component to display products will go here */}

      <Table data={data} isLoading={loading}>
        <Table.Filters>{/** Filters will go here */}
          <Table.SearchTextInput searchFields={["Name"]} searchType="fullText" />
        </Table.Filters>
        <Table.Grid>
          <Table.Field name="ProductID" />
          <Table.Field name="Name" />
          <Table.Field name="Category" />
          <Table.Field name="Price" sortable />
          <Table.Field name="Stock" sortable />
          <Table.ProdcutRatingField name="Rating" sortable />
        </Table.Grid>
        <Table.Pagination />
      </Table>
    </div>
  );
};

export default App;
