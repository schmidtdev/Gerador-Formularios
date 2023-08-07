<template>
  <q-page padding class="row justify-evenly">
    <q-card class="col-3" flat>
      <q-card-section>
        <q-card-actions class="row justify-between">
          <q-btn
            flat
            color="negative"
            label="Limpar"
            @click="clearForm"
          />
          <q-btn
            flat
            icon="picture_as_pdf"
            color="secondary"
            label="Gerar Preview"
            @click="exportPreview"
          />
        </q-card-actions>
        <q-list class="rounded-borders">
          <q-input
            v-model="formName"
            type="text"
            label="Nome do Formulário"
            dense
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="formCode"
            type="text"
            label="Código do Formulário"
            dense
            outlined
            class="q-mb-md"
          />

          <q-separator spaced inset />

          <q-expansion-item
            expand-separator
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
        </q-list>
      </q-card-section>
    </q-card>

    <q-separator spaced inset vertical />

    <q-card class="flex col-8" flat>
      <draggable
        v-model="form"
        :move="onMove"
        draggable=".draggable"
        class="full-width q-pa-md"
        id="formPreview"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div class="row q-mb-lg">
          <span class="col-6 text-center text-bold text-primary">
            Formulário: {{ formName }}
          </span>
          <span class="col-6 text-center text-bold text-primary">
            ID: {{ formCode }}
          </span>
        </div>

        <transition-group type="transition" name="flip-list">
          <div
            class="row col-12 items-center justify-evenly q-my-sm draggable"
            v-for="entry in form"
            :key="entry.id"
          >
            <div style="cursor: grab;" v-if="entry" class="row col-12 items-center justify-evenly q-my-sm non-selectable">
              <span class="col-6 text-bold">
                {{ entry.question }}
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
            </div>
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

export default defineComponent({
  name: 'IndexPage',

  components: {
    draggable: VueDraggableNext
  },

  methods: {
    exportPreview () {
      html2pdf(document.getElementById('formPreview'), {
        margin: 2,
        filename: `${this.formCode}-${this.formName}.pdf`
      })
    },

    clearForm () {
      this.form = []
      this.formName = null
      this.formCode = null
    },

    onMove (ev) {
      console.log(ev.relatedContext.list)
    },

    addInput (type) {
      const id = this.form.length + 1
      switch (type) {
        case 'text':
          if (!this.text.question) {
            alert('O descritivo é necessário')
            break
          }
          this.form.push({
            id,
            input: 'text',
            question: this.text.question,
            type: this.text.type,
            order: id
          })
          this.text.question = null
          break
        case 'selection':
          if (!this.selection.question) {
            alert('O descritivo é necessário')
            break
          }
          this.form.push({
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
          this.form.push({
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
          this.form.push({
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
        default:
          alert('Nenhum input selecionado')
          break
      }
    },

    createSelectionValue (val, done) {
      done(val, 'add-unique')
    }
  },

  data () {
    return {
      enabled: true,
      dragging: false,

      formName: null,
      formCode: null,
      form: [],

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
      }
    }
  }
})
</script>

<style>
  .flip-list-move {
    transition: transform 0.5s;
  }
</style>
