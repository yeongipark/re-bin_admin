import ProductDetail from "@/components/products.detail/productDetail";

export default function Page({ params }: { params: { id: number | string } }) {
  return <ProductDetail id={params.id} />;
}
