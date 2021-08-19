import { defineComponent, PropType, ref } from "@nuxtjs/composition-api";
import type { Card } from '~/api/@types'
import styles from '~/components/styles.module.css'

export const DragHandler = defineComponent({
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    delete: { 
      type: Function as PropType<() => void>, 
      required: true 
    },
    input: {
      type: Function as PropType<(text: string) => void>,
      required: true
    },
    movedata: {
      type: Function as PropType<(position: Card['position']) => void>,
      required: true
    },
    getPosition: {
      type: Function as PropType<(position: {x:number,y:number}) => void>,
      required: true,
    },
  },
  setup(props) {
    const isMove = ref(false)
    const x = ref(0)
    const y = ref(0)
    const mousedown = (e: MouseEvent) => {
      if (!isMove.value) {
        isMove.value = true
        x.value = props.card.position.x
        y.value = props.card.position.y
      }
    }
    const mousemove = (e: MouseEvent) => {
      if (isMove.value) {
        x.value = x.value + e.movementX
        y.value = y.value + e.movementY
        props.getPosition({x:x.value,y:y.value})
        props.movedata({x:x.value,y:y.value})
        isMove.value = true
      }
    }
    const mouseup = (e: MouseEvent) => {
      if (!isMove.value) {
        x.value = props.card.position.x
        y.value = props.card.position.y
        props.getPosition({x:x.value,y:y.value})
        props.movedata({x:x.value,y:y.value})
      }
      isMove.value = false
    }

    const onClick = () => props.delete()
    return () => (
      <div>
        <div
        class={styles.stickyArea} 
          onMousedown={mousedown}
          onMouseup={mouseup}
          onMousemove={mousemove}
          />
        <button class={styles.deleteButtom} type="submit" onClick={onClick}>
            ×
        </button>
      </div>
    )
  }
})
