import { IsNotEmpty } from "class-validator";

export class TransactionDTO {
	@IsNotEmpty()
	vendor: string;
	@IsNotEmpty()
	accountId: number;
	@IsNotEmpty()
	amount: number;
	@IsNotEmpty()
	type: string;
	@IsNotEmpty()
	category: string;
}

export class Transaction {
	id: number;
	vendor: string;
	account_id: number;
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
	Other: Record<string, Transaction[]>; // e.g., "June 15": [...]
};
