import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import FacePlugin from './plugins/FacePlugin';
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    // createSharedMutations()   //多标签使用vuex
    FacePlugin
  ],
  strict: process.env.NODE_ENV !== 'production'
})
