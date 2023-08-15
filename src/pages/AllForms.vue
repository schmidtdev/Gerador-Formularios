<template>
  <q-page padding>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AllForms',

  mounted () {
    this.$q.loading.show()
    if (this.$route.path === '/autorizar') {
      this.$q.localStorage.set('apiToken', this.$route.query.token)
      this.$q.localStorage.set('codEmpresa', this.$route.query.empresa)

      this.$router.push('formularios')
    }

    this.$q.loading.hide()
  }
})
</script>
