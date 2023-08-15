const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'autorizar', component: () => import('pages/AllForms.vue') },
      { path: 'formularios', component: () => import('pages/IndexPage.vue') },
      { path: 'parametros', component: () => import('pages/ParametrosAnalise.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
