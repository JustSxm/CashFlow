import { IsNotEmpty } from "class-validator";

export class BaseTransactionDTO {
	@IsNotEmpty()
	accountId: number;
	@IsNotEmpty()
	amount: number;
}

export class TransactionDTO extends BaseTransactionDTO {
	@IsNotEmpty()
	vendor: string;
	@IsNotEmpty()
	type: string;
	@IsNotEmpty()
	category: string;
}

export class Transaction {
	id: number;
	vendor: string;
	account_id: number;
	accountDestination?: number;
	amount: number;
	type: string;
	category: string;
	date: Date;
}

export type GroupedTransactions = {
	Today: Transaction[];
	Yesterday: Transaction[];
	"This Week": Transaction[];
	"Last Week": Transaction[];
	Other: Record<string, Transaction[]>;
};

export class TransferDTO extends BaseTransactionDTO {
	@IsNotEmpty()
	accountDestinationId: number;
}
