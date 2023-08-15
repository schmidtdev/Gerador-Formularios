<template>
  <q-page class="row">
    <q-card
      class="col-3"
      flat
      style="border-right: 1px solid #ccc"
    >
      <q-card-actions class="row justify-between">
        <q-btn
          flat
          color="negative"
          label="Limpar"
          @click="clearForm"
        />
        <div class="row">
          <q-btn
            flat
            icon="save"
            color="positive"
            @click="saveForm"
          />
          <q-btn
            flat
            icon="picture_as_pdf"
            color="secondary"
            label="Gerar Preview"
            @click="exportPreview"
          />
        </div>
      </q-card-actions>

      <q-expansion-item
        expand-separator
        header-class="text-bold text-primary"
        group="menu"
        icon="settings"
        label="Dados do formulário"
      >
        <div class="q-pa-sm">
          <p class="text-center text-bold text-secondary q-mt-sm">Posição da imagem</p>
          <q-btn-toggle
            v-model="logoAlign"
            toggle-color="positive"
            spread
            flat
            class="q-my-sm"
            color="negative"
            :options="[
              {label: 'Esquerda', value: 'left'},
              {label: 'Centro', value: 'center'},
              {label: 'Direita', value: 'right'}
            ]"
          />
          <q-toggle
            v-model="showHeader"
            color="primary"
            label="Mostrar cabeçalho"
          />
          <q-input
            v-model="formName"
            type="text"
            label="Nome do Formulário"
            dense
            outlined
            class="full-width q-my-sm"
          />
          <q-input
            v-model="formCode"
            type="text"
            label="Código do Formulário"
            dense
            outlined
            class="col-6 q-mb-sm"
          />
          <q-input
            outlined
            dense
            label="Data de validação"
            class="q-mb-sm"
            v-model="validationDate"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="validationDate" :locale="dateLocale" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            outlined
            dense
            label="Próxima validação"
            class="q-mb-sm"
            v-model="expireDate"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="expireDate" :locale="dateLocale" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        header-class="text-bold text-primary"
        group="menu"
        icon="feed"
        label="Descritivo Geral"
      >
        <div class="q-pa-md">
          <q-input
            v-model="textarea.question"
            type="text"
            label="Descritivo (o que deve ser respondido/informado)"
            dense
            outlined
            class="q-my-sm"
          />
          <q-btn
            color="primary"
            label="Adicionar"
            class="full-width"
            @click="addInput('textarea')"
          />
        </div>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        header-class="text-bold text-primary"
        group="menu"
        icon="table_view"
        label="Agrupamento"
        caption="Separar campos por seções"
      >
        <div class="q-pa-md">
          <q-input
            v-model="group.description"
            type="text"
            label="Nome do grupo"
            dense
            outlined
            class="q-my-sm"
          />
          <q-btn
            color="primary"
            label="Adicionar"
            class="full-width"
            @click="addGroup"
          />
        </div>
      </q-expansion-item>

      <q-list class="rounded-borders">
        <q-expansion-item
          expand-separator
          header-class="text-bold text-primary"
          group="menu"
          icon="keyboard"
          label="Campos"
          caption="Adicionar campos ao formulário"
        >
          <div class="q-pa-md">
            <q-select
              v-model="groupSelect"
              :options="groups"
              label="Adicionar campo ao grupo"
              outlined
              dense
              map-options
              emit-value
              option-label="description"
              option-value="id"
            />
          </div>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="text_fields"
            label="Campo de texto"
          >
            <div class="q-pa-md">
              <q-input
                v-model="text.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="text.type"
                :options="textOptions"
                label="Tipo de campo"
                map-options
                emit-value
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('text')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="text_fields"
            label="Textos múltiplos"
          >
            <div class="q-pa-md">
              <q-input
                v-model="multipleText.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="multipleText.options"
                label="Opções (enter para adicionar)"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createSelectionValue"
                clearable
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('multipleText')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="text_fields"
            label="Textos parametrizados"
          >
            <div class="q-pa-md">
              <q-input
                v-model="parameterText.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="parameterText.options"
                label="Parâmetros (enter para adicionar)"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createSelectionValue"
                clearable
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('parameterText')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="format_list_bulleted"
            label="Lista de seleção"
          >
            <div class="q-pa-md">
              <q-input
                v-model="selection.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="selection.options"
                label="Opções (enter para adicionar)"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createSelectionValue"
                clearable
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('selection')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="check_box"
            label="Seleção múltipla"
          >
            <div class="q-pa-md">
              <q-input
                v-model="checkboxes.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="checkboxes.options"
                label="Opções (enter para adicionar)"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createSelectionValue"
                clearable
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('checkbox')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="radio_button_checked"
            label="Seleção única"
          >
            <div class="q-pa-md">
              <q-input
                v-model="radio.question"
                type="text"
                label="Descritivo (o que deve ser respondido/informado)"
                dense
                outlined
              />
              <q-select
                v-model="radio.options"
                label="Opções (enter para adicionar)"
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createSelectionValue"
                clearable
                dense
                outlined
                class="q-my-sm"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('radio')"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            header-class="text-secondary"
            group="submenu"
            icon="attachment"
            label="Anexar arquivo"
          >
            <div class="q-pa-md">
              <q-input
                v-model="file.question"
                type="text"
                label="Descritivo (o que deve ser anexado)"
                dense
                outlined
              />
              <q-checkbox
                v-model="file.multiple"
                label="Múltiplos anexos?"
              />
              <q-btn
                color="primary"
                label="Adicionar"
                class="full-width"
                @click="addInput('file')"
              />
            </div>
          </q-expansion-item>
        </q-expansion-item>
      </q-list>

      <q-expansion-item
        expand-separator
        icon="inventory"
        header-class="text-bold text-primary"
        group="menu"
        label="Análise de Produtos"
      >
        <div class="q-pa-md">
          <q-select
            v-model="groupSelect"
            :options="groups"
            label="Adicionar campo ao grupo"
            outlined
            dense
            map-options
            emit-value
            option-label="description"
            option-value="id"
          />
          <q-select
            v-model="product.id"
            :options="products"
            label="Produto"
            outlined
            dense
            use-input
            clearable
            map-options
            emit-value
            option-label="descricao"
            option-value="cnproduto"
            class="q-my-sm"
          />
          <q-select
            v-model="requirement"
            :options="requirements"
            label="Avaliações"
            outlined
            dense
            use-input
            use-chips
            clearable
            map-options
            emit-value
            multiple
            option-label="description"
            option-value="description"
            class="q-mb-sm"
          />
          <q-btn
            color="primary"
            label="Adicionar"
            class="full-width"
            @click="addInput('requirement')"
          />
        </div>
      </q-expansion-item>
    </q-card>

    <q-card
      class="column col-9"
      :class="toolbarHidden ? 'col-12' : 'col-8'"
      flat
      id="formPreview"
    >
      <div class="q-mb-lg q-pa-md full-width" >
        <q-markup-table class="full-width" flat dense>
          <thead>
            <tr>
              <th v-if="logoAlign === 'left'" width="100px">
                <q-img
                  src="../assets/logo.png"
                  :ratio="1"
                  spinner-color="primary"
                  spinner-size="82px"
                  width="100px"
                />
              </th>
              <th :colspan="logoAlign === 'center' ? 4 : 3" class="text-left">
                <div class="row items-center">
                  <div class="column" :class="logoAlign === 'center' ? 'col-5' : 'col-6'">
                    <span>
                      Empresa: GR Sistemas
                    </span>
                    <span>
                      CNPJ: 00.000.000.0001/00
                    </span>
                    <span>
                      E-mail: contato@webgr.com.br
                    </span>
                    <span>
                      Telefone: (11) 99999-9999
                    </span>
                  </div>

                  <div v-if="logoAlign === 'center'" class="text-center col-2">
                    <q-img
                      src="../assets/logo.png"
                      :ratio="1"
                      spinner-color="primary"
                      spinner-size="82px"
                      width="100px"
                    />
                  </div>

                  <div class="column text-right" :class="logoAlign === 'center' ? 'col-5' : 'col-6'">
                    <span>
                      Cliente: Cliente Teste
                    </span>
                    <span>
                      CNPJ: 00.000.000.0001/00
                    </span>
                    <span>
                      E-mail: contato@cliente.com.br
                    </span>
                    <span>
                      Telefone: (11) 99999-9999
                    </span>
                  </div>
                </div>
              </th>
              <th v-if="logoAlign === 'right'" width="100px">
                <q-img
                  src="../assets/logo.png"
                  :ratio="1"
                  spinner-color="primary"
                  spinner-size="82px"
                  width="100px"
                />
              </th>
            </tr>
          </thead>
          <thead class="text-uppercase text-bold" v-if="showHeader">
            <tr>
              <th class="text-center text-bold">Código</th>
              <th class="text-center text-bold">Formulário</th>
              <th class="text-center text-bold">Data de validação</th>
              <th class="text-center text-bold">Próxima validação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="showHeader">
              <td class="text-center">{{ formCode }}</td>
              <td class="text-center">{{ formName }}</td>
              <td class="text-center">{{ validationDate }}</td>
              <td class="text-center">{{ expireDate }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div
        class="column q-mb-sm full-width"
        v-for="entry in form"
        :key="entry.id"
      >
        <q-slide-item @right="removeInput(null, entry.id)" right-color="negative" style="cursor: grab;" v-if="entry.type === 'textarea'" class="full-width q-my-sm non-selectable">
          <template v-slot:right>
            <q-icon name="delete" />
          </template>

          <q-item v-if="entry.type === 'textarea'" class="column col-12">
            <q-item-section class="q-mb-md text-center text-bold">
              <q-item-label>{{ entry.question }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <span v-if="entry.input === 'textarea'" class="col-12 text-center">
                <q-input
                  :type="entry.type"
                  label="Resposta"
                  dense
                  outlined
                  class="col-12"
                />
              </span>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </div>

      <draggable
        class="full-width q-px-sm"
        :group="{ name: 'groups', pull: true, put: false }"
        v-if="groups.length > 0"
      >
        <transition-group type="transition" name="flip-list">
          <div
            class="row col-12 items-center justify-evenly q-mb-sm"
            v-for="group in groups"
            :key="group.id"
          >
            <q-slide-item @right="removeGroup(group.id)" right-color="negative" style="cursor: grab" v-if="group.id" class="full-width non-selectable">
              <template v-slot:right>
                <q-icon name="delete" />
              </template>

              <q-item class="row full-width items-center justify-between">
                <q-item-section avatar style="min-height: 80px; border-right: 1px solid #ccc">
                  <span class="text-center text-bold text-uppercase text-primary" style="transform: rotate(270deg); min-width: 50px; width: 80px">
                    {{ group.description }}
                  </span>
                </q-item-section>

                <q-item-section style="min-height: 80px; border: 1px solid #ccc;">
                  <draggable
                    v-model="group.items"
                    class="full-width q-px-sm"
                    direction="vertical"
                    :group="{ name: 'list', pull: true, put: true }"
                    v-if="group.items.length > 0"
                  >
                    <transition-group type="transition" name="flip-list">
                      <div
                        class="row items-center justify-evenly q-px-sm q-py-xs"
                        v-for="entry in group.items"
                        :key="entry.id"
                      >
                        <q-slide-item @right="removeInput(group.id, entry.id)" right-color="negative" style="cursor: grab" v-if="entry.id" class="full-width non-selectable">
                          <template v-slot:right>
                            <q-icon name="delete" />
                          </template>

                          <div class="row items-center justify-evenly q-px-sm q-py-xs">
                            <span class="col-6" v-if="entry.input !== 'requirement'">
                              {{ entry.question }}
                            </span>
                            <span class="col-6" v-if="entry.input === 'requirement'">
                              {{ entry.product }}
                            </span>
                            <span v-if="entry.input === 'text'" class="col-6 text-center">
                              <q-input
                                :type="entry.type"
                                label="Resposta"
                                dense
                                outlined
                                class="col-12"
                              />
                            </span>

                            <span v-if="entry.input === 'multipleText'" class="col-6 row items-center justify-evenly">
                              <q-input
                                v-for="option in entry.options"
                                :key="option"
                                type="text"
                                :label="option"
                                dense
                                outlined
                                :class="`q-px-xs col-${Math.round(12 / entry.options.length)}`"
                              />
                            </span>

                            <span v-if="entry.input === 'parameterText'" class="col-6 row items-center justify-evenly">
                              <div class="row col-12 items-center justify-evenly">
                                <q-input
                                  label="Resposta"
                                  dense
                                  outlined
                                  class="col-6"
                                />

                                <div class="column col-6 q-px-md">
                                  <span
                                    class="col-12 text-bold"
                                    v-for="option in entry.options"
                                    :key="option"
                                  >
                                    {{ option }}
                                  </span>
                                </div>
                              </div>
                            </span>

                            <span v-if="entry.input === 'selection'" class="col-6 text-center">
                              <q-select
                                label="Seleção"
                                dense
                                outlined
                                :options="entry.options"
                                class="col-12"
                              />
                            </span>

                            <span v-if="entry.input === 'checkbox'" class="col-6 text-center">
                              <q-option-group
                                :options="entry.options"
                                inline
                                type="checkbox"
                              />
                            </span>

                            <span v-if="entry.input === 'radio'" class="col-6 text-center">
                              <q-option-group
                                :options="entry.options"
                                inline
                              />
                            </span>

                            <span v-if="entry.input === 'file'" class="col-6 text-center">
                              <q-file
                                label="Anexar arquivo"
                                :multiple="entry.multiple"
                                :append="entry.multiple"
                                clearable
                                use-chips
                                dense
                                outlined
                                class="q-my-sm"
                              />
                            </span>

                            <span v-if="entry.input === 'requirement'" class="col-6 text-center">
                              <div class="column col-12 items-center justify-evenly">
                                <div
                                  v-for="requirement in entry.requirements"
                                  :key="requirement.description"
                                  class="row col-12 items-center justify-between q-py-xs"
                                >
                                  <span class="col-2 text-right q-pr-md">{{ requirement.label }}</span>
                                  <div class="col-10 row items-center justify-evenly">
                                    <q-input
                                      v-for="evaluation in requirement.evaluation"
                                      :key="evaluation"
                                      type="text"
                                      :label="evaluation"
                                      dense
                                      outlined
                                      :class="`q-px-xs col-${Math.round(12 / requirement.evaluation.length)}`"
                                    />
                                  </div>
                                </div>
                              </div>
                            </span>
                          </div>
                        </q-slide-item>
                      </div>
                    </transition-group>
                  </draggable>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </div>
        </transition-group>
      </draggable>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import html2pdf from 'html2pdf.js'
import avaliacoes from '../services/avaliacoes'
import produtos from 'src/services/produtos'

export default defineComponent({
  name: 'IndexPage',

  components: {
    draggable: VueDraggableNext
  },

  methods: {
    exportPreview () {
      this.toolbarHidden = true
      const opt = {
        margin: 10,
        filename: `${this.formCode}-${this.formName}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 300,
          letterRendering: true,
          width: 1080,
          height: 1920
        },
        jsPDF: {
          orientation: 'l',
          unit: 'mm',
          format: 'a4'
        },
        pagebreak: {
          mode: ['avoid-all', 'css']
        }
      }
      html2pdf().set(opt).from(document.getElementById('formPreview')).save()

      this.toolbarHidden = false
    },

    clearForm () {
      this.groups = []
      this.formName = null
      this.formCode = null
      this.validationDate = null
      this.expireDate = null
    },

    onMove (ev) {
      console.log(ev.relatedContext.list)
    },

    saveForm () {
      this.$q.loading.show()
      const noGroup = this.groups.findIndex(el => el.id === null)

      const form = {
        formName: this.formName,
        formCode: this.formCode,
        validationDate: this.validationDate,
        expireDate: this.expireDate,
        descriptive: this.descriptiveField,
        fields: this.groups.splice(noGroup, 1)
      }

      console.log(form)

      this.$q.loading.hide()
    },

    addGroup () {
      this.groups.push({
        id: this.groups.length + 1,
        description: this.group.description,
        order: this.groups.length + 1,
        items: []
      })

      this.group = {
        id: null,
        description: null,
        order: null,
        items: []
      }
    },

    addInput (type) {
      const id = this.form.length + 1
      const groupIndex = this.groups.findIndex(el => el.id === this.groupSelect)

      if (!this.groupSelect) {
        if (type !== 'textarea') {
          return alert('É necessário selecionar um agrupamento para adicionar campos')
        }
      }
      switch (type) {
        case 'text':
          if (!this.text.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'text',
            question: this.text.question,
            type: this.text.type,
            order: id
          })
          this.text.question = null
          break
        case 'multipleText':
          if (!this.multipleText.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'multipleText',
            question: this.multipleText.question,
            options: this.multipleText.options,
            order: id
          })
          this.multipleText.question = null
          this.multipleText.options = []
          break
        case 'parameterText':
          if (!this.parameterText.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'parameterText',
            question: this.parameterText.question,
            options: this.parameterText.options,
            order: id
          })
          this.parameterText.question = null
          this.parameterText.options = []
          break
        case 'textarea':
          if (!this.textarea.question) {
            alert('O descritivo é necessário')
            break
          }
          this.descriptiveField.push({
            id,
            input: 'textarea',
            question: this.textarea.question,
            type: 'textarea',
            order: id
          })

          this.textarea.question = null
          break
        case 'selection':
          if (!this.selection.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'selection',
            question: this.selection.question,
            options: this.selection.options,
            order: id
          })
          this.selection.question = null
          this.selection.options = []
          break
        case 'checkbox':
          if (!this.checkboxes.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'checkbox',
            question: this.checkboxes.question,
            options: this.checkboxes.options.map(opt => {
              return {
                label: opt,
                value: opt
              }
            }),
            order: id
          })
          this.checkboxes.question = null
          this.checkboxes.options = []
          break
        case 'radio':
          if (!this.radio.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'radio',
            question: this.radio.question,
            options: this.radio.options.map(opt => {
              return {
                label: opt,
                value: opt
              }
            }),
            order: id
          })
          this.radio.question = null
          this.radio.options = []
          break
        case 'file':
          if (!this.file.question) {
            alert('O descritivo é necessário')
            break
          }
          this.groups[groupIndex].items.push({
            id,
            input: 'file',
            question: this.file.question,
            file: this.file.file,
            multiple: this.file.multiple,
            order: id
          })
          this.file.question = null
          this.file.file = null
          break
        case 'requirement':
          if (!this.product.id) {
            alert('Selecione um produto')
            break
          }
          if (!this.requirement) {
            alert('Selecione ao menos uma especificação')
            break
          }

          this.groups[groupIndex].items.push({
            id,
            input: 'requirement',
            product: this.products.find(el => el.id === this.product.id).description,
            requirements: this.requirement.map(el => {
              return {
                label: el,
                evaluation: this.requirements.find(req => req.description === el).evaluation
              }
            }),
            order: id
          })

          this.product.id = null
          this.requirement = []
          break
        default:
          alert('Configure um campo para adicioná-lo')
          break
      }
    },

    removeGroup (id) {
      const index = this.groups.findIndex(el => el.id === id)

      this.groups.splice(index, 1)
    },

    removeInput (group, id) {
      if (group) {
        const indexGroup = this.groups.findIndex(el => el.id === group)
        const index = this.groups[indexGroup].items.findIndex(el => el.id === id)

        this.groups[indexGroup].items.splice(index, 1)
      } else {
        const index = this.form.findIndex(el => el.id === id)

        this.form.splice(index, 1)
      }
    },

    createSelectionValue (val, done) {
      done(val, 'add-unique')
    },

    async listarProdutos (query) {
      await produtos.getAll(this.$q.localStorage.getItem('codEmpresa'), query)
        .then((res) => {
          this.products = res.data.response.produtos.rows.map(el => {
            return {
              cnproduto: el.cnproduto,
              descricao: el.descricao.toUpperCase(),
              cncomercial: el.cncomercial.toUpperCase()
            }
          })
        })
    },

    async listarAvaliacoes () {
      await avaliacoes.getAll(this.$q.localStorage.getItem('codEmpresa'))
        .then((res) => {
          this.requirements = []
          res.data.forEach(el => {
            const body = {
              cnavaliacao: el.cnavaliacao,
              descricao: el.produto.descricao,
              requisito: el.requisito[0].descricao,
              cnproduto: el.cnproduto,
              cnrequisito: el.cnrequisito,
              status: el.status === 'S' ? 'ATIVO' : 'INATIVO'
            }

            this.requirements.push(body)
          })
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    }
  },

  async mounted () {
    await this.listarProdutos()
    await this.listarAvaliacoes()
  },

  data () {
    return {
      enabled: true,
      dragging: false,
      toolbarHidden: false,

      showHeader: true,

      logoAlign: 'center',

      dateLocale: {
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexata_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jab_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      },

      formName: 'FORM NAME',
      formCode: 'XXXX_XXXX-XX',
      validationDate: '09-08-2022',
      expireDate: '15-08-2023',

      groupSelect: null,
      group: {
        description: null
      },
      groups: [
        {
          id: null,
          description: 'Sem grupo',
          order: null,
          items: []
        }
      ],

      form: [],

      pdfOptions: [
        {
          label: 'Retrato',
          value: 'p'
        },
        {
          label: 'Paisagem',
          value: 'l'
        }
      ],

      text: {
        question: null,
        type: 'text'
      },
      textOptions: [
        {
          label: 'Texto geral',
          value: 'text'
        },
        {
          label: 'Apenas números',
          value: 'number'
        }
      ],

      multipleText: {
        question: null,
        options: []
      },

      parameterText: {
        question: null,
        options: []
      },

      textarea: {
        question: null
      },

      descriptiveField: {
        question: null
      },

      selection: {
        question: null,
        options: []
      },

      checkboxes: {
        question: null,
        options: []
      },

      radio: {
        question: null,
        options: []
      },

      file: {
        question: null,
        file: null,
        multiple: false
      },

      evaluation: [],

      products: [],
      product: {
        id: null,
        description: null,
        requirements: []
      },
      requirements: [],
      requirement: []
    }
  }
})
</script>

<style>
  .flip-list-move {
    transition: transform 0.5s;
  }
</style>
