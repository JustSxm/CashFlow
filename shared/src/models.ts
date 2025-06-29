import { IsNotEmpty } from "class-validator";

export class UserDTO {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;
}

export class User {
	id!: number;
	username: string;
}

export class CreateTransactionDTO {
	@IsNotEmpty()
	amount: number;

	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	date: Date;
}
