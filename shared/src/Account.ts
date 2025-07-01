import { IsNotEmpty, IsOptional } from "class-validator";

export class AccountDTO {
	@IsNotEmpty()
	accountName!: string;

	@IsNotEmpty()
	type!: string;

	@IsNotEmpty()
	amount!: number;

	@IsOptional()
	limit: string;
}

export class Account {
	id!: number;
	name!: string;
	type!: string;
	balance!: number;
	limit!: string;
}
