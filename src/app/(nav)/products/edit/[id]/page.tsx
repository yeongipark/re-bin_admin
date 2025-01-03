import ProductEdit from "@/components/products.edit/productEdit";

export default function Page({ params }: { params: { id: number | string } }) {
  return <ProductEdit id={params.id} />;
}
