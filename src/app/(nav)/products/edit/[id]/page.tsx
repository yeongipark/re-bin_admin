import ProductEdit from "@/components/products.edit/productEdit";
import ProtectedPage from "@/components/protectedRouter";

export default function Page({ params }: { params: { id: number | string } }) {
  return <ProtectedPage><ProductEdit id={params.id} /></ProtectedPage>;
}
