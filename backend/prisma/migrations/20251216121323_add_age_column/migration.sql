-- AlterTable
ALTER TABLE "blocks" ADD COLUMN     "indent_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parent_id" UUID;
