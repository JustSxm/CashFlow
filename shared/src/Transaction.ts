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
