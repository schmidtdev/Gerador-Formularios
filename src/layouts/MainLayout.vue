<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          color="white"
          icon="arrow_back"
          label="Voltar ao gestor"
          outline
          tag="a"
          href="http://localhost:8081/dashboard"
        />
        <q-toolbar-title>
          Configuração de Formulários
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :mini="mini"
      @mouseover="mini = false"
      @mouseout="mini = true"
      mini-to-overlay
      show-if-above
      elevated
      class="bg-primary"
    >
      <q-list>
        <q-item-section
          :avatar="true"
          class="q-mb-md q-mt-sm"
        >
          <img
            src="/icons/favicon-128x128.png"
            alt="Logo"
            :class="mini ? 'full-width' : 'self-center q-pa-sm'"
            style="border-radius: 5px; border: 1px solid #cecece; background-color: #fff"
          >
        </q-item-section>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Formulários',
    icon: 'edit_note',
    link: 'formularios'
  },
  {
    title: 'Parâmetros de análise',
    icon: 'check_box',
    link: 'parametros'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const drawer = ref(false)
    const mini = ref(true)

    return {
      essentialLinks: linksList,
      drawer,
      mini
    }
  }
})
</script>
