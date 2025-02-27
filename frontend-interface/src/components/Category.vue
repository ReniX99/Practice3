<script setup lang="ts">
  import Good from './Good.vue'
  interface IGood {
    id: number
    name: string
    price: number
    description: string
    categories: string[]
  }

  interface ICategory {
    name: string
    goods: IGood[]
  }

  const props = defineProps<ICategory>()
</script>

<template>
  <div>
    <h2 class="text-xl">{{ props.name }}</h2>
    <div class="grid grid-cols-5 gap-4 mt-3">
      <Good
        v-for="good in props.goods"
        :key="good.id"
        :name="good.name"
        :price="good.price"
        :description="good.description"
      ></Good>
    </div>
  </div>
</template>
