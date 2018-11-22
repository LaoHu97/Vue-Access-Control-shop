<template>
  <div>
    <textarea id="tinymceId"></textarea>
  </div>
</template>
<script>
  import plugins from './plugins';
  import toolbar from "./toolbar";
  import images_upload_handler from "./images_upload_handler";
  export default {
    name: 'tinymce',
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id || 'tinymceId'
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
      }
    },
    mounted() {
      this.initTinymce()
    },
    activated() {
      this.initTinymce()
    },
    deactivated() {
      this.destroyTinymce()
    },
    methods: {
      initTinymce() {
        const _this = this
        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          language: 'zh_CN',
          height: 450,
          fontsize_formats: '8pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt',
          images_upload_handler: images_upload_handler,
          plugins: plugins,
          toolbar: toolbar,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          }
        });
      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
    },
    destroyed() {
      this.destroyTinymce()
    }
  }

</script>
