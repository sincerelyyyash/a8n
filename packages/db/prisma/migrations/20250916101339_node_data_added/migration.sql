/*
  Warnings:

  - Added the required column `data` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Node" ADD COLUMN     "data" JSONB NOT NULL;
