import { prisma } from "@/lib/prisma";
import Link from "next/link";
// Pastikan path ini mengarah ke file action Anda yang berisi fungsi addToCart
import { addToCart } from "@/app/action/action"; 

export default async function ProductsPage() {
  // Mengekstrak seluruh data produk dari database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Pembungkus Server Action untuk menangani input form
  const handleAddToCart = async (formData: FormData) => {
    "use server";
    const productId = formData.get("productId") as string;
    
    if (productId) {
      // Pastikan fungsi addToCart di action.ts Anda siap menerima parameter ini
      // Sesuaikan argumen pemanggilan ini dengan struktur parameter di action.ts Anda
      await addToCart(productId); 
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        <Link 
          href="/cart" 
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-md transition-colors"
        >
          Lihat Keranjang
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Belum ada produk di etalase.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
              <div className="p-5 flex-grow">
                <h2 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                  {product.productName}
                </h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                  {product.description || "Tidak ada deskripsi."}
                </p>
                <div className="text-xl font-bold text-blue-600">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t mt-auto">
                <form action={handleAddToCart}>
                  {/* Hidden input untuk mengirim ID secara rahasia ke server */}
                  <input type="hidden" name="productId" value={product.id} />
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
                  >
                    Tambah ke Keranjang
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}