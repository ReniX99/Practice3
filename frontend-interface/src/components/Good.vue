<script setup lang="ts">
  interface Good {
    name: string
    price: number
    description: string
  }

  const props = defineProps<Good>()
</script>

<template>
  <div class="py-4 px-2 border-3 border-orange-400 rounded-xl hover:-translate-y-2 transition">
    <div class="flex flex-col gap-2">
      <h2>{{ props.name }}</h2>
      <p>{{ props.price }}</p>
      <p>{{ props.description }}</p>
    </div>
  </div>
</template>
