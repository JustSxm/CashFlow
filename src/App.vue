<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDoubleIcon, Chart03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Badge } from "@/components/ui/badge";
</script>

<template>
	<main class="px-3 pt-3 flex flex-col gap-3 bg-background text-foreground">
		<h1 class="text-lg">Welcome Back, Sam</h1>
		<Card class="">
			<CardHeader class="relative">
				<CardTitle class="">Monthly Overview</CardTitle>
				<div class="flex items-center gap-1 absolute right-4 top-0 flex-col">
					<Badge class="bg-primary/20 text-primary"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary" />+15%</Badge>
				</div>
			</CardHeader>
			<CardContent class="flex flex-col gap-2">
				<div class="flex items-center">
					<p class="text-4xl tabular-nums font-bold">934 $</p>
				</div>

				<span>
					<span class="flex gap-1 items-center"><HugeiconsIcon :icon="ArrowUpDoubleIcon" class="w-4 h-4 text-primary" />Up 15% this month</span>
					<span class="text-muted-foreground">versus the same date last month</span>
				</span>
			</CardContent>
		</Card>
	</main>
</template>
