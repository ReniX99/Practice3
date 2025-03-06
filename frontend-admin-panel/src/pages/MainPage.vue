<script setup lang="ts">
  import axios from 'axios'
  import { onMounted, reactive, ref, watch } from 'vue'

  const categories = ref<string[]>(['Техника', 'Смартфоны', 'Ноутбуки', 'Аксессуары'])

  interface IExisitingGood {
    id: number | undefined
    name: string
    price: number | string
    description: string
    categories: string[]
  }

  interface INewGood {
    name: string
    price: number | string
    description: string
    categories: string[]
  }

  const currrentGood = reactive<IExisitingGood>({
    id: undefined,
    name: '',
    price: 0,
    description: '',
    categories: [],
  })

  const newGood = reactive<INewGood>({
    name: '',
    price: 0,
    description: '',
    categories: [],
  })

  const goods = ref<IExisitingGood[]>([])

  const getGoods = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/goods')

      goods.value = data
    } catch (err) {
      console.log(err)
    }
  }

  const changeId = (): void => {
    const exisitingGood: IExisitingGood = goods.value.filter((g) => g.id === currrentGood.id)[0]

    currrentGood.name = exisitingGood.name
    currrentGood.price = exisitingGood.price
    currrentGood.description = exisitingGood.description
    currrentGood.categories = exisitingGood.categories
  }

  const addClick = async (event) => {
    event.preventDefault()

    try {
      const data: INewGood = {
        name: newGood.name,
        price: typeof newGood.price === 'string' ? parseInt(newGood.price) : newGood.price,
        description: newGood.description,
        categories: newGood.categories,
      }

      await axios.post('http://localhost:3000/goods', data)
    } catch (err) {
      console.log(err)
    }
    console.log(currrentGood)
  }

  const updateClick = async (event) => {
    event.preventDefault()

    try {
      const id: number = currrentGood.id

      const data: INewGood = {
        name: currrentGood.name,
        price:
          typeof currrentGood.price === 'string'
            ? parseInt(currrentGood.price)
            : currrentGood.price,
        description: currrentGood.description,
        categories: currrentGood.categories,
      }

      await axios.put(`http://localhost:3000/goods/${id}`, data)

      currrentGood.id = undefined
      currrentGood.name = ''
      currrentGood.price = 0
      currrentGood.description = ''
      currrentGood.categories = []
    } catch (err) {
      console.log(err)
    }
  }

  const deleteClick = async (event) => {
    event.preventDefault()

    try {
      const id: number = currrentGood.id

      await axios.delete(`http://localhost:3000/goods/${id}`)

      currrentGood.id = undefined
      currrentGood.name = ''
      currrentGood.price = 0
      currrentGood.description = ''
      currrentGood.categories = []
    } catch (err) {
      console.log(err)
    }
  }

  onMounted(getGoods)
</script>

<template>
  <div class="w-[900px] mx-auto py-[20px]">
    <h1 class="text-center text-[30px] mb-[18px]">Админ-панель</h1>
    <div class="flex justify-between">
      <section class="flex flex-col items-center gap-[20px]">
        <h2 class="text-[20px]">Существующие товары</h2>
        <form
          class="min-w-[350px] flex flex-col gap-[12px] border-2 border-gray rounded-xl px-[20px] py-[16px] bg-[#bad1b2] text-[16px]"
        >
          <div class="flex flex-col gap-[4px]">
            <label>ID</label>
            <select
              v-model="currrentGood.id"
              class="bg-white p-[8px] border-2 border-gray"
              @change="changeId"
            >
              <option v-for="good in goods" :key="good.id" :value="good.id">{{ good.id }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Название</label>
            <input
              v-model="currrentGood.name"
              class="bg-white p-[8px] border-2 border-gray"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Цена: </label>
            <input
              v-model="currrentGood.price"
              class="bg-white p-[8px] border-2 border-gray"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Описание</label>
            <textarea
              v-model="currrentGood.description"
              class="bg-white p-[8px] border-2 border-gray"
            ></textarea>
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Категории: </label>
            <select
              multiple
              class="bg-white p-[8px] border-2 border-gray"
              v-model="currrentGood.categories"
            >
              <option v-for="(category, index) in categories" :key="index" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <section class="flex justify-evenly">
            <button
              @click="updateClick"
              class="p-[8px] bg-amber-500 rounded-[8px] cursor-pointer hover:scale-105"
            >
              Редактировать
            </button>
            <button
              @click="deleteClick"
              class="p-[8px] bg-red-500 rounded-[8px] cursor-pointer hover:scale-105"
            >
              Удалить
            </button>
          </section>
        </form>
      </section>
      <section class="flex flex-col gap-[20px] items-center">
        <h2 class="text-[20px]">Новый товар</h2>
        <form
          class="min-w-[350px] flex flex-col gap-[16px] border-2 border-gray rounded-xl px-[20px] py-[16px] bg-[#bad1b2] text-[16px]"
        >
          <div class="flex flex-col gap-[4px]">
            <label>Название: </label>
            <input
              v-model="newGood.name"
              class="bg-white p-[8px] border-2 border-gray"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Цена: </label>
            <input
              v-model="newGood.price"
              class="bg-white p-[8px] border-2 border-gray"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Описание: </label>
            <textarea
              v-model="newGood.description"
              class="bg-white p-[8px] border-2 border-gray"
            ></textarea>
          </div>
          <div class="flex flex-col gap-[4px]">
            <label>Категории: </label>
            <select
              multiple
              class="bg-white p-[8px] border-2 border-gray"
              v-model="newGood.categories"
            >
              <option v-for="(category, index) in categories" :key="index" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <section class="flex justify-evenly">
            <button
              @click="addClick"
              class="p-[8px] bg-green-500 rounded-[8px] cursor-pointer hover:scale-105"
            >
              Добавить
            </button>
          </section>
        </form>
      </section>
    </div>
  </div>
</template>
