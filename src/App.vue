<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple01Icon, ArrowUpDoubleIcon, Calendar04Icon, Car05FreeIcons, Chart03Icon, MoneyBag02Icon, Restaurant02Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Badge } from "@/components/ui/badge";
import Progress from "./components/ui/progress/Progress.vue";
</script>

<template>
	<h1 class="px-3 text-lg">Welcome Back, Sam</h1>
	<main class="px-3 pt-3 flex flex-col gap-3 bg-background text-foreground">
		<Card class="bg-linear-to-br from-primary to-primary-600 border border-white/20 h-44">
			<CardHeader class="relative">
				<CardTitle class="flex items-center gap-2 text-primary-foreground">
					<div class="bg-white/20 backdrop-blur-sm rounded-lg p-2">
						<HugeiconsIcon :icon="Calendar04Icon" class="w-6 h-6 text-primary-foreground/70" />
					</div>
					Monthly Overview
				</CardTitle>
				<div class="flex items-center gap-1 absolute right-4 top-0 flex-col">
					<Badge class="border border-primary-foreground/30 bg-transparent text-primary-foreground"
						><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary-foreground" />+15%</Badge
					>
				</div>
			</CardHeader>
			<CardContent class="flex flex-col gap-2 text-primary-foreground">
				<div class="flex items-center">
					<p class="text-4xl tabular-nums font-bold tracking-tighter">934 $</p>
				</div>

				<span>
					<span class="flex gap-1 items-center"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary-200" />Up 15% this month</span>
					<span class="text-xs text-muted/70">versus the same date last month</span>
				</span>
			</CardContent>
		</Card>

		<div class="flex gap-3">
			<Card class="w-full h-44">
				<CardHeader class="relative">
					<CardTitle class="flex flex-col gap-2">
						<div class="bg-primary-200 rounded-lg p-2 w-min">
							<HugeiconsIcon :icon="Wallet01Icon" class="w-6 h-6 text-primary-500" />
						</div>

						Liquidity
					</CardTitle>
					<div class="flex items-center gap-1 absolute right-4 top-0 flex-col">
						<Badge class="bg-primary-200 text-primary-500"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary-500" />+15%</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex flex-col h-full justify-between">
					<div class="flex items-center">
						<p class="text-4xl tabular-nums font-bold tracking-tighter">11 934 $</p>
					</div>

					<span>
						<span class="flex gap-1 items-center text-muted-foreground text-xs"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary" />Up 15% this month</span>
					</span>
				</CardContent>
			</Card>
			<Card class="w-full h-44">
				<CardHeader class="relative">
					<CardTitle class="flex flex-col gap-2">
						<div class="bg-primary-200 rounded-lg p-2 w-min">
							<HugeiconsIcon :icon="MoneyBag02Icon" class="w-6 h-6 text-primary-500" />
						</div>

						Surplus
					</CardTitle>
					<div class="flex items-center gap-1 absolute right-4 top-0 flex-col">
						<Badge class="bg-primary-200 text-primary-500"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary-500" />+15%</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex flex-col h-full justify-between">
					<div class="flex items-center">
						<p class="text-4xl tabular-nums font-bold tracking-tighter">934 $</p>
					</div>

					<span>
						<span class="flex gap-1 items-center text-muted-foreground text-xs"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary" />Up 15% last month</span>
					</span>
				</CardContent>
			</Card>
		</div>
		<Card class="">
			<CardHeader class="relative">
				<CardTitle class="">Top Categories</CardTitle>
				<div class="flex items-center gap-1 absolute right-4 top-0 flex-col text-xs text-muted-foreground">MONTH TO DATE</div>
			</CardHeader>
			<CardContent class="flex flex-col gap-4">
				<div class="flex gap-2">
					<div class="p-2 rounded-lg bg-secondary">
						<HugeiconsIcon :icon="Restaurant02Icon" class="w-auto h-4" />
					</div>
					<div class="flex flex-col gap-1 w-full">
						<div class="flex justify-between">
							<span>Restaurants</span>
							<span>820$</span>
						</div>
						<Progress :model-value="100" class="h-1.5" />
					</div>
				</div>
				<div class="flex gap-2">
					<div class="p-2 rounded-lg bg-secondary">
						<HugeiconsIcon :icon="Car05FreeIcons" class="w-4 h-4" />
					</div>
					<div class="flex flex-col gap-1 w-full">
						<div class="flex justify-between">
							<span>Car</span>
							<span>770$</span>
						</div>
						<Progress :model-value="88" class="h-1.5" />
					</div>
				</div>
				<div class="flex gap-2">
					<div class="p-2 rounded-lg bg-secondary">
						<HugeiconsIcon :icon="Apple01Icon" class="w-4 h-4" />
					</div>
					<div class="flex flex-col gap-1 w-full">
						<div class="flex justify-between">
							<span>Groceries</span>
							<span>720$</span>
						</div>
						<Progress :model-value="75" class="h-1.5" />
					</div>
				</div>
			</CardContent>
		</Card>
	</main>
</template>
