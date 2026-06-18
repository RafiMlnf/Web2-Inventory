import icons from '../icons.js'

export default {
  name: 'AppModal',
  props: {
    show:  { type: Boolean, default: false },
    title: { type: String, default: 'Modal' },
    size:  { type: String, default: 'md' }, // sm | md | lg
  },
  emits: ['close'],
  data() { return { icons } },
  computed: {
    maxWidth() {
      return { sm: '400px', md: '520px', lg: '680px' }[this.size] ?? '520px'
    }
  },
  template: `
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
          <div class="modal-box" :style="{ maxWidth }">
            <div class="modal-header">
              <h3>{{ title }}</h3>
              <button class="btn-icon" @click="$emit('close')" v-html="icons.x" style="border:none;"></button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  `
}
