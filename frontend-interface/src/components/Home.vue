<script setup lang="ts">
  import Category from './Category.vue'

  import axios from 'axios'
  import { onMounted, ref } from 'vue'

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

  const categories = ref<Set<string>>(new Set())

  const categoriesArray = ref<ICategory[]>([])

  const fetchGoods = async () => {
    try {
      const res = await axios.get('http://localhost:8800/goods')

      const data: IGood[] = res.data
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].categories.length; j++) {
          categories.value.add(data[i].categories[j])
        }
      }

      for (const category of categories.value) {
        categoriesArray.value.push({
          name: category,
          goods: [],
        })
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].categories.length; j++) {
            if (data[i].categories[j] === category) {
              categoriesArray.value[categoriesArray.value.length - 1].goods.push(data[i])
            }
          }
        }
        console.log(categoriesArray)
      }
    } catch (err) {
      console.log(err)
    }
  }

  onMounted(fetchGoods)
</script>

<template>
  <div>
    <main class="max-w-5xl mx-auto my-5">
      <h1 class="text-center mb-5 text-3xl font-semibold">Товары</h1>
      <div class="flex flex-col gap-8">
        <Category
          v-for="(category, index) in categoriesArray"
          :key="index"
          :name="category.name"
          :goods="category.goods"
        ></Category>
      </div>
    </main>
  </div>
</template>
