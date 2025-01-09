import ProductDetail from "@/components/products.detail/productDetail";
import ProtectedPage from "@/components/protectedRouter";

export default function Page({ params }: { params: { id: number | string } }) {
  return <ProtectedPage><ProductDetail id={params.id} /></ProtectedPage>;
}
