-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "vendor" VARCHAR(100),
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100),
    "date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
