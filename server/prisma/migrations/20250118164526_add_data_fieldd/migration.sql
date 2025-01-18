/*
  Warnings:

  - You are about to drop the column `link` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Story` table. All the data in the column will be lost.
  - Added the required column `data` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Story` DROP COLUMN `link`,
    DROP COLUMN `title`,
    ADD COLUMN `data` VARCHAR(191) NOT NULL;
