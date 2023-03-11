-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_trainingId_fkey`;

-- AlterTable
ALTER TABLE `exercise` MODIFY `trainingId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `Training`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
