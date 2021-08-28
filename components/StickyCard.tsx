import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import type { Card } from '~/api/@types'
import styles from '~/components/styles.module.css'
import { DragHandler } from './DragHandler'

export const StickyCard = defineComponent({
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    input: {
      type: Function as PropType<(text: string) => void>,
      required: true,
    },
    updatePosition: {
      type: Function as PropType<(position: Card['position']) => void>,
      required: true,
    },
    delete: { type: Function as PropType<() => void>, required: true },
    updateZindex: {
      type: Function as PropType<(zIndex: Card['zIndex']) => void>,
      required: true,
    },
    getZindex: {
      type: Number as PropType<Card['zIndex']>,
      required: false,
    },
    sidebarWidth: {
      type: Number as PropType<Number>,
      required: true,
    },
  },
  setup(props) {
    const stickycardzindex = ref()
    const isForcusing = ref(false)
    const localtext = ref(props.card.text)
    const x = ref(props.card.position.x)
    const y = ref(props.card.position.y)
    const cardHeight = ref(320)
    const cardWidth = ref(240)
    const windowWidth = ref(window.innerWidth)
    const windosHeight = ref(window.innerHeight)
    const sidebarWidth = ref()
    sidebarWidth.value = props.sidebarWidth
    const reSize = () => {
      windowWidth.value = window.innerWidth
      windosHeight.value = window.innerHeight
    }
    onMounted(() => {
      window.addEventListener('resize', reSize, false)
      reSize()
    })
    onUnmounted(() => {
      window.removeEventListener('resize', reSize, false)
    })
    const text = computed(() =>
      isForcusing.value ? localtext.value : props.card.text
    )
    const onInput = ({ target }: Event) => {
      if (!(target instanceof HTMLTextAreaElement)) return
      localtext.value = target.value
      props.input(target.value)
    }
    const getPosition = (position: { x: number; y: number }) => {
      x.value = position.x
      if (x.value < 0) {
        x.value = 0
      }
      if (
        windowWidth.value - cardWidth.value <
        position.x + sidebarWidth.value
      ) {
        x.value = windowWidth.value - cardWidth.value - sidebarWidth.value
      }
      y.value = position.y
      if (y.value < 0) {
        y.value = 0
      }
      if (windosHeight.value - cardHeight.value < position.y) {
        y.value = windosHeight.value - cardHeight.value
      }
    }
    const getZindex = () => {
      stickycardzindex.value = props.getZindex
      props.updateZindex(stickycardzindex.value)
    }
    const onFocus = () => (isForcusing.value = true)
    const onBlur = () => (isForcusing.value = false)
    return () => (
      <div onMousedown={() => getZindex()}>
        <div
          class={styles.cardContainer}
          style={{
            top: `${y.value}px`,
            left: `${x.value}px`,
            zIndex: stickycardzindex.value,
            height: `${cardHeight.value}px`,
            width: `${cardWidth.value}px`,
            backgroundColor: props.card.color,
          }}
        >
          <DragHandler
            card={props.card}
            delete={() => props.delete()}
            input={props.input}
            updatePosition={(position) => props.updatePosition(position)}
            getPosition={getPosition}
          />
          <textarea
            style="border:none;"
            class={styles.textArea}
            value={text.value}
            onInput={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
          ></textarea>
        </div>
      </div>
    )
  },
})
