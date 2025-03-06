<script setup lang="ts">
import { onMounted } from 'vue'

let editor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['ai'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    const aiIcon = `<svg t="1741261522704" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16787" style="width: 32px; height: 32px; font-size: 32px;"><path d="M533.333333 292.949333a42.666667 42.666667 0 1 0-42.666666 0V341.333333H341.333333a85.333333 85.333333 0 0 0-85.333333 85.333334v277.333333a85.333333 85.333333 0 0 0 85.333333 85.333333h341.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V426.666667a85.333333 85.333333 0 0 0-85.333333-85.333334h-149.333334V292.949333zM533.333333 384H682.666667a42.666667 42.666667 0 0 1 42.666666 42.666667v277.333333a42.666667 42.666667 0 0 1-42.666666 42.666667H341.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V426.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h192zM213.333333 469.333333a21.333333 21.333333 0 0 1 21.333334 21.333334v128a21.333333 21.333333 0 0 1-42.666667 0v-128A21.333333 21.333333 0 0 1 213.333333 469.333333z m234.666667 149.333334a21.333333 21.333333 0 0 0 0 42.666666h128a21.333333 21.333333 0 0 0 0-42.666666h-128zM810.666667 469.333333a21.333333 21.333333 0 0 1 21.333333 21.333334v128a21.333333 21.333333 0 0 1-42.666667 0v-128a21.333333 21.333333 0 0 1 21.333334-21.333334z m-341.333334 42.666667a42.666667 42.666667 0 1 0-85.333333 0 42.666667 42.666667 0 0 0 85.333333 0z m170.666667 0a42.666667 42.666667 0 1 0-85.333333 0 42.666667 42.666667 0 0 0 85.333333 0z" p-id="16788"></path></svg>`
    const icons = FluentEditor.import('ui/icons')
    icons.ai = aiIcon

    editor = new FluentEditor('#editor', {
      theme: 'snow',
      modules: {
        ai: true,
        toolbar: {
          container: TOOLBAR_CONFIG,
          handlers: {
            ai() {
              console.log('ai')
            }, 
          }
        },
      }
    })
  })
})
</script>

<template>
  <div id="editor"></div>
  <div></div>
</template>
