interface Product {
  ProductID: string;
  Name: string;
  Category: string;
  Price: number;
  Stock: number;
  Rating: number;
}

export function parseProducts(products: Product[]): Product[] {
  const parsedProducts: Product[] = [];
  const productIDs = new Set<string>();

  products.forEach((product) => {
    const { ProductID, Name, Category, Price, Stock, Rating } = product;

    // Skip duplicate ProductID
    if (productIDs.has(ProductID.toString())) return;
    productIDs.add(ProductID.toString());

    // Handle missing values
    const name = Name || 'Unknown';
    const category = Category || 'Uncategorized';

    // Convert and validate Price
    const price = parseFloat(Price);
    const validPrice = isNaN(price) ? 0 : price;

    // Convert and validate Stock
    const stock = parseInt(Stock, 10);
    const validStock = isNaN(stock) || stock < 0 ? 0 : stock;

    // Convert and validate Rating
    const rating = parseInt(Rating, 10);
    const validRating = isNaN(rating) || rating < 1 || rating > 5 ? 3 : rating;

    parsedProducts.push({
      ProductID,
      Name: name,
      Category: category,
      Price: validPrice,
      Stock: validStock,
      Rating: validRating,
    });
  });

  return parsedProducts;
}
