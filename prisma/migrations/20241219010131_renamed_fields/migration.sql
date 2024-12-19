/*
  Warnings:

  - You are about to drop the column `productCategoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `products` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_sellerId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "productCategoryId",
DROP COLUMN "sellerId",
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "product_category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
