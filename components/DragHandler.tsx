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
    }
  },
  setup(props) {
    const isMove = ref(false)
    const postion = ref(props.card.position)
    const mousedown = () => {
      isMove.value = true
      console.log(isMove.value)
    }
    const mouseup = () => {
      isMove.value = false
      console.log(isMove.value)
    }
    const mousemove = (e: MouseEvent) => {
      if (isMove.value) {
        // x,yのデータを親に渡す。
        console.log(e.offsetX)
        console.log(e.offsetY)
        props.movedata({x:e.offsetX ,y:e.offsetY})
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
