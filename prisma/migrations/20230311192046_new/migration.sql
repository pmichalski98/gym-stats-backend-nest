/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Training` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_trainingId_fkey`;

-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_userId_fkey`;

-- AlterTable
ALTER TABLE `training` MODIFY `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Exercise_id_key` ON `Exercise`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Training_id_key` ON `Training`(`id`);

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `Training`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
