import ProductForm from "@/components/products.create/ProductForm";
import ProtectedPage from "@/components/protectedRouter";

export default function Page() {
  return (
    <ProtectedPage>
      <ProductForm />
    </ProtectedPage>
  );
}
