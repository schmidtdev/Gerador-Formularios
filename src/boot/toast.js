import { boot } from 'quasar/wrappers'
import Toast, { POSITION } from 'vue-toastification'

import 'vue-toastification/dist/index.css'

const options = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.use(Toast, options)
})
