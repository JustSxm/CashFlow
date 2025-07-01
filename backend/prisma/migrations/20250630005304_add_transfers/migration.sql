-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "accountDestination" INTEGER;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountDestination_fkey" FOREIGN KEY ("accountDestination") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
