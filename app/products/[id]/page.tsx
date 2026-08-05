import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
// IMPORT CLIENT COMPONENT
import AddToCartButton from "./add-to-cart-button"; 

export default async function BuyerProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      seller: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:text-black flex items-center gap-2 mb-8">
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Galeri Gambar */}
        <div className="bg-gray-100 rounded-2xl aspect-square relative flex items-center justify-center p-4 overflow-hidden">
          {product.images.length > 0 ? (
             <img 
               src={product.images[0].imageUrl} 
               alt={product.productName}
               className="object-cover w-full h-full rounded-xl shadow-sm"
             />
          ) : (
            <div className="text-gray-400 font-medium">No Image Available</div>
          )}
        </div>

        {/* Detail Produk */}
        <div className="flex flex-col justify-start">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
            {product.category?.categoryName || "Uncategorized"}
          </span>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {product.productName}
          </h1>
          
          <div className="text-2xl font-bold text-blue-600 mb-6">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase">
                {product.seller?.organizationName?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-xs text-gray-500">Organized by</p>
                <p className="font-semibold text-sm">{product.seller?.organizationName || "Unknown Seller"}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Product Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {product.description || "Tidak ada deskripsi tersedia untuk produk ini."}
            </p>
          </div>

          {/* INJEKSI TOMBOL INTERAKTIF */}
          <div className="w-full mb-6">
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 mt-auto">
            <div className="flex flex-col items-center text-center">
              <span className="text-blue-500 text-2xl mb-1">🛡️</span>
              <span className="text-xs font-medium text-gray-600">Verified Student Initiative</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-blue-500 text-2xl mb-1">🔒</span>
              <span className="text-xs font-medium text-gray-600">Secure Simulations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}