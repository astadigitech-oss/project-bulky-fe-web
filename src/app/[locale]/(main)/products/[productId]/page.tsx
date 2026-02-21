import React from "react";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  return <div>ini produk ke-{productId}</div>;
};

export default ProductDetailPage;
