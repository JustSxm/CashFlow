import type { Component, VNode } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

export type DropdownOption = {
  label: string
  value: string | number
  icon?: Component
}
