import { products } from "@/app/data/products";
import { ProductCard } from "./ProductCard";

export const Products = () => (
  <section id="03-products" className="py-12 px-6">
    <h2 className="text-muted-foreground text-sm mb-6">
      <span className="text-accent">{"// "}</span>
      03. products
    </h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.name}
          name={product.name}
          url={product.url}
          description={product.description}
        />
      ))}
    </div>
  </section>
);
