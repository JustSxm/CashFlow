<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<template>
	<main class="px-3 pt-3 text-primary-950 flex flex-col gap-3">
		<h1 class="font-bold text-xl">Home</h1>
		<Card class="bg-linear-to-br from-primary-900 to-primary-700">
			<CardHeader>
				<CardTitle class="text-white">Card Title</CardTitle>
				<CardDescription class="text-white">Card Description</CardDescription>
			</CardHeader>
			<CardContent class="text-white">
				<p>Card Content</p>
			</CardContent>
		</Card>
	</main>
</template>
