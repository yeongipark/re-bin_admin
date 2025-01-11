import ProductForm from "@/components/products.create/productForm";
import ProtectedPage from "@/components/protectedRouter";

export default function Page() {
  return (
    <ProtectedPage>
      <ProductForm />
    </ProtectedPage>
  );
}
