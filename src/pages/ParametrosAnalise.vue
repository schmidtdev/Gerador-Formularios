<template>
  <q-page padding class="row items-start justify-evenly">
    <q-card class="col-8" flat>
      <q-card-section>
        <q-tabs
          v-model="tabTable"
          :vertical="false"
          align="center"
          active-color="primary"
          indicator-color="primary"
          :stretch="true"
          :dense="true"
        >
          <q-tab name="requisitos" label="Requisitos" />
          <q-tab name="avaliacoes" label="Avaliações" />
        </q-tabs>

        <q-tab-panels v-model="tabTable" animated>
          <q-tab-panel name="requisitos">
            <q-table
              :rows="requisitos"
              :columns="columns"
              dense
              flat
              table-header-class="bg-secondary text-white text-bold text-uppercase"
              class="col-7"
              :filter="filter"
              :pagination="pagination"
            >
              <template #top>
                <q-input
                  v-model="filter"
                  type="search"
                  debounce="300"
                  label="Buscar requisitos"
                  dense
                  outlined
                  class="col-12"
                >
                  <template #append>
                    <q-icon name="search" />
                  </template>

                  <template #prepend>
                    <q-btn
                      color="grey-6"
                      icon="filter_alt"
                      flat
                      dense
                    />
                  </template>

                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  @click="getRequisito(props.row)"
                  class="cursor-pointer"
                >
                  <q-td key="cnrequisito" :props="props">
                    {{ props.row.cnrequisito }}
                  </q-td>
                  <q-td key="descricao" :props="props">
                    {{ props.row.descricao }}
                  </q-td>
                  <q-td key="avaliacoes" :props="props">
                    <span
                      v-for="item in props.row.avaliacoes"
                      :key="item"
                    >
                      <q-badge
                        color="primary"
                        text-color="white"
                        :label="item"
                        class="q-mr-xs"
                      />
                    </span>
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="avaliacoes">
            <q-table
              :rows="avaliacoes"
              :columns="columnsAval"
              dense
              flat
              table-header-class="bg-secondary text-white text-bold text-uppercase"
              class="col-7"
              :filter="filterAval"
              :pagination="pagination"
            >
              <template #top>
                <q-input
                  v-model="filterAval"
                  type="search"
                  debounce="300"
                  label="Buscar avaliações por produto"
                  dense
                  outlined
                  class="col-12"
                >
                  <template #append>
                    <q-icon name="search" />
                  </template>

                  <template #prepend>
                    <q-btn
                      color="grey-6"
                      icon="filter_alt"
                      flat
                      dense
                    />
                  </template>

                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  @click="getAvaliacao(props.row)"
                  class="cursor-pointer"
                >
                  <q-td key="cnavaliacao" :props="props">
                    {{ props.row.cnavaliacao }}
                  </q-td>
                  <q-td key="descricao" :props="props">
                    {{ props.row.descricao }}
                  </q-td>
                  <q-td key="requisito" :props="props">
                    {{ props.row.requisito }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <q-card class="col-4">
      <q-card-section>
        <q-tabs
          v-model="tab"
          :vertical="false"
          align="center"
          :breakpoint="600"
          active-color="secondary"
          indicator-color="secondary"
          :stretch="true"
          :dense="true"
        >
          <q-tab name="requisitos" label="Requisitos" />
          <q-tab name="avaliacoes" label="Avaliações" />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          :animated="true"
          :swipeable="true"
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel
            name="requisitos"
          >
            <q-input
              v-model="requisito.descricao"
              type="text"
              label="Descrição"
              dense
              outlined
              class="q-mb-md"
            />

            <q-select
              v-model="requisito.parametros"
              :options="options"
              label="Parâmetros de avaliação (enter para inserir)"
              outlined
              dense
              use-input
              use-chips
              clearable
              multiple
              hide-dropdown-icon
              input-debounce="0"
              @new-value="createNewValue"
            />

            <q-btn
              v-if="requisito.cnrequisito"
              :color="requisito.status === 'S' ? 'positive' : 'negative'"
              outline
              :label="requisito.status === 'S' ? 'ativo' : 'inativo'"
              @click="requisito.status === 'S' ? requisito.status = 'N' : requisito.status = 'S'"
              class="full-width q-mt-md"
            />
          </q-tab-panel>
          <q-tab-panel name="avaliacoes">
            <q-select
              v-model="avaliacao.cnproduto"
              :options="filteredProds"
              label="Produto"
              outlined
              map-options
              emit-value
              use-input
              option-label="descricao"
              option-value="cnproduto"
              input-debounce="300"
              dense
              @filter="filterProds"
              class="q-mb-md"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.descricao }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.cncomercial }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-model="avaliacao.cnrequisito"
              :options="filteredReqs"
              label="Requisito"
              outlined
              map-options
              emit-value
              use-input
              option-label="descricao"
              option-value="cnrequisito"
              input-debounce="300"
              dense
              @filter="filterRequisitos"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.descricao }}</q-item-label>
                    <q-item-label caption>
                      <span v-for="avaliacao in scope.opt.avaliacoes" :key="avaliacao">
                        <q-badge
                          color="grey-9"
                          text-color="white"
                          :label="avaliacao"
                          class="q-mr-sm"
                        />
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-btn
              v-if="avaliacao.cnavaliacao"
              :color="avaliacao.status === 'S' ? 'positive' : 'negative'"
              outline
              :label="avaliacao.status === 'S' ? 'ativo' : 'inativo'"
              @click="avaliacao.status === 'S' ? avaliacao.status = 'N' : avaliacao.status = 'S'"
              class="full-width q-mt-md"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="center" v-if="tab === 'requisitos'">
        <q-btn flat color="negative" label="limpar" @click="limparRequisito" />
        <q-btn
          flat
          color="primary"
          :label="requisito.cnrequisito ? 'modificar' : 'cadastrar'"
          @click="requisito.cnrequisito ? modificarRequisito() : salvarRequisito()"
        />
      </q-card-actions>
      <q-card-actions align="center" v-if="tab === 'avaliacoes'">
        <q-btn flat color="negative" label="limpar" @click="limparAvaliacao" />
        <q-btn
          flat
          color="primary"
          :label="avaliacao.cnavaliacao ? 'modificar' : 'cadastrar'"
          @click="avaliacao.cnavaliacao ? modificarAvaliacao() : salvarAvaliacao()"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import requisitos from '../services/requisitos'
import avaliacoes from '../services/avaliacoes'
import produtos from 'src/services/produtos'

const toast = useToast()

export default defineComponent({
  name: 'ParametrosAnalise',

  data () {
    return {
      tab: 'requisitos',
      tabTable: 'requisitos',

      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 15
      },

      columns: [
        { name: 'cnrequisito', field: 'cnrequisito', label: 'ID', align: 'left', sortable: true },
        { name: 'descricao', field: 'descricao', label: 'Requisito', align: 'left', sortable: true },
        { name: 'avaliacoes', field: 'avaliacoes', label: 'Avaliações', align: 'left', sortable: true },
        { name: 'status', field: 'status', label: 'Status', align: 'left', sortable: true }
      ],

      columnsAval: [
        { name: 'cnavaliacao', field: 'cnavaliacao', label: 'ID', align: 'left', sortable: true },
        { name: 'descricao', field: 'descricao', label: 'Produto', align: 'left', sortable: true },
        { name: 'requisito', field: 'requisito', label: 'Requisito', align: 'left', sortable: true },
        { name: 'status', field: 'status', label: 'Status', align: 'left', sortable: true }
      ],

      filter: null,
      filterAval: null,

      requisitos: [],
      filteredReqs: [],

      requisito: {
        cnrequisito: null,
        descricao: null,
        parametros: [],
        status: null
      },

      produtos: [],
      filteredProds: [],

      avaliacoes: [],
      filteredAval: [],

      avaliacao: {
        cnproduto: null,
        cnrequisito: null,
        status: null
      }
    }
  },

  methods: {
    createNewValue (val, done) {
      val = val.toUpperCase()

      done(val, 'add-unique')
    },

    getRequisito (row) {
      this.requisito = {
        cnrequisito: row.cnrequisito,
        descricao: row.descricao,
        parametros: row.avaliacoes,
        status: row.status === 'ATIVO' ? 'S' : 'N'
      }
    },

    limparRequisito () {
      this.requisito = {
        cnrequisito: null,
        descricao: null,
        parametros: []
      }
    },

    async salvarRequisito () {
      this.$q.loading.show()

      if (!this.requisito.descricao) {
        return toast.error('O requisito requer uma descrição')
      }

      if (this.requisito.parametros.length <= 0) {
        return toast.error('O requisito requer ao menos um parâmetro')
      }

      const body = {
        descricao: this.requisito.descricao.toUpperCase(),
        avaliacoes: this.requisito.parametros,
        cnempresa: this.$q.localStorage.getItem('codEmpresa')
      }

      await requisitos.create(body)
        .then(async () => {
          await this.listarRequisitos()
        })
        .finally(() => {
          this.limparRequisito()
          this.$q.loading.hide()
        })
    },

    async modificarRequisito () {
      this.$q.loading.show()

      if (!this.requisito.descricao) {
        return toast.error('O requisito requer uma descrição')
      }

      if (this.requisito.parametros.length <= 0) {
        return toast.error('O requisito requer ao menos um parâmetro')
      }

      const body = {
        descricao: this.requisito.descricao.toUpperCase(),
        avaliacoes: this.requisito.parametros,
        cnempresa: this.$q.localStorage.getItem('codEmpresa'),
        status: this.requisito.status
      }

      await requisitos.modify(this.requisito.cnrequisito, body)
        .then(async () => {
          await this.listarRequisitos()
        })
        .finally(() => {
          this.limparRequisito()
          this.$q.loading.hide()
        })
    },

    getAvaliacao (row) {
      this.avaliacao = {
        cnavaliacao: row.cnavaliacao,
        cnrequisito: row.cnrequisito,
        cnproduto: row.cnproduto,
        status: row.status === 'ATIVO' ? 'S' : 'N'
      }
    },

    limparAvaliacao () {
      this.avaliacao = {
        cnrequisito: null,
        cnproduto: null,
        status: null
      }
    },

    async salvarAvaliacao () {
      this.$q.loading.show()

      if (!this.avaliacao.cnproduto) {
        return toast.error('É necessário selecionar um produto')
      }

      if (!this.avaliacao.cnrequisito) {
        return toast.error('É necessário selecionar um requisito')
      }

      const body = {
        cnrequisito: this.avaliacao.cnrequisito,
        cnproduto: this.avaliacao.cnproduto,
        cnempresa: this.$q.localStorage.getItem('codEmpresa')
      }

      await avaliacoes.create(body)
        .then(async () => {
          await this.listarAvaliacoes()
        })
        .finally(() => {
          this.limparAvaliacao()
          this.$q.loading.hide()
        })
    },

    async modificarAvaliacao () {
      this.$q.loading.show()

      if (!this.avaliacao.cnproduto) {
        return toast.error('É necessário selecionar um produto')
      }

      if (this.avaliacao.cnrequisito) {
        return toast.error('É necessário selecionar um requisito')
      }

      const body = {
        cnrequisito: this.avaliacao.cnrequisito,
        cnproduto: this.avaliacao.cnproduto,
        cnempresa: this.$q.localStorage.getItem('codEmpresa'),
        status: this.requisito.status
      }

      await avaliacoes.modify(this.avaliacao.cnavaliacao, body)
        .then(async () => {
          await this.listarAvaliacoes()
        })
        .finally(() => {
          this.limparAvaliacao()
          this.$q.loading.hide()
        })
    },

    async listarRequisitos () {
      await requisitos.getAll(this.$q.localStorage.getItem('codEmpresa'))
        .then((res) => {
          this.requisitos = []
          res.data.forEach(req => {
            const body = {
              cnrequisito: req.cnrequisito,
              descricao: req.descricao,
              avaliacoes: req.avaliacoes,
              status: req.status === 'S' ? 'ATIVO' : 'INATIVO'
            }

            this.requisitos.push(body)
          })
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },

    async listarAvaliacoes () {
      await avaliacoes.getAll(this.$q.localStorage.getItem('codEmpresa'))
        .then((res) => {
          this.avaliacoes = []
          res.data.forEach(el => {
            const body = {
              cnavaliacao: el.cnavaliacao,
              descricao: el.produto.descricao,
              requisito: el.requisito[0].descricao,
              cnproduto: el.cnproduto,
              cnrequisito: el.cnrequisito,
              status: el.status === 'S' ? 'ATIVO' : 'INATIVO'
            }

            this.avaliacoes.push(body)
          })
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },

    async listarProdutos (query) {
      await produtos.getAll(this.$q.localStorage.getItem('codEmpresa'), query)
        .then((res) => {
          this.produtos = res.data.response.produtos.rows.map(el => {
            return {
              cnproduto: el.cnproduto,
              descricao: el.descricao.toUpperCase(),
              cncomercial: el.cncomercial.toUpperCase()
            }
          })
        })
    },

    filterProds (val, update, abort) {
      if (val === '') {
        update(() => {
          this.filteredProds = this.produtos
        })
      }
      update(async () => {
        const needle = val.toUpperCase()
        this.filteredProds = this.produtos.filter(v => v.descricao.indexOf(needle) > -1)
      })
    },

    filterRequisitos (val, update, abort) {
      if (val === '') {
        update(() => {
          this.filteredReqs = this.requisitos
        })
      }
      update(async () => {
        const needle = val.toUpperCase()
        this.filteredReqs = this.requisitos.filter(v => v.descricao.indexOf(needle) > -1)
      })
    },

    filterAvaliacoes (val, update, abort) {
      if (val === '') {
        update(() => {
          this.filteredAval = this.avaliacoes
        })
      }
      update(async () => {
        const needle = val.toUpperCase()
        this.filteredAval = this.avaliacoes.filter(v => v.descricao.toUpperCase().indexOf(needle) > -1)
      })
    }
  },

  async mounted () {
    this.$q.loading.show()
    await this.listarRequisitos()
    await this.listarProdutos()
    await this.listarAvaliacoes()
  }
})
</script>
