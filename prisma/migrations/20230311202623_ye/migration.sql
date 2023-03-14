/*
  Warnings:

  - Made the column `trainingId` on table `exercise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `training` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_trainingId_fkey`;

-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_userId_fkey`;

-- AlterTable
ALTER TABLE `exercise` MODIFY `trainingId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `training` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `Training`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
