/*
  Warnings:

  - The primary key for the `exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `training` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `training` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `traininginstance` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `trainingId` on table `exercise` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `title` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_trainingId_fkey`;

-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_userId_fkey`;

-- DropForeignKey
ALTER TABLE `traininginstance` DROP FOREIGN KEY `TrainingInstance_trainingId_fkey`;

-- AlterTable
ALTER TABLE `exercise` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `trainingId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `training` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `traininginstance`;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `Training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
