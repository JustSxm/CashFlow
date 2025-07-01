import { IsNotEmpty } from "class-validator";

export class SettingsDTO {
	@IsNotEmpty()
	savingMode!: boolean;

	@IsNotEmpty()
	percentage!: number;

	@IsNotEmpty()
	startOfTheWeek!: number;

	@IsNotEmpty()
	defaultDashboardView!: number;
}

export class Settings {
	saving_mode!: boolean;
	percentage!: number;
	start_of_the_week!: number;
	default_dashboard_view!: number;
}
