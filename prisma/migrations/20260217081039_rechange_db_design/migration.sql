/*
  Warnings:

  - Added the required column `quantity` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PROCESS';

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalAmount" DROP NOT NULL;
