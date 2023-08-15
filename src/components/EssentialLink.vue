<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="link"
    v-if="!children"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" color="white" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-white">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item
    :icon="icon"
    expand-icon-class="text-white"
    :label="title"
    :content-inset-level="1"
    group="nav"
    header-class="text-white"
    v-else
  >
    <template #default>
      <q-item
        v-for="child in children"
        :key="child.title"
        clickable
        tag="a"
        target="_blank"
        :href="child.link"
      >
        <q-item-section>
          <q-item-label class="text-white">{{ child.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-expansion-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    children: {
      type: Array
    }
  }
})
</script>
