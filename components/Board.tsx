import {
  defineComponent,
  PropType,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import type { Card } from '~/api/@types'
import styles from '~/components/styles.module.css'
import { StickyCard } from './StickyCard'
const imageStyles = [
  styles.boardBackgroundRoom1,
  styles.boardBackgroundRoom2,
  styles.boardBackgroundRoom3,
]
export const Board = defineComponent({
  props: {
    cards: {
      type: Array as PropType<Card[]>,
      required: true,
    },
    input: {
      type: Function as PropType<
        (cardId: Card['cardId'], text: string) => void
      >,
      required: true,
    },
    add: {
      type: Function as PropType<() => void>,
      required: true,
    },
    delete: {
      type: Function as PropType<(cardId: Card['cardId']) => void>,
      required: true,
    },
    updatePosition: {
      type: Function as PropType<
        (cardId: Card['cardId'], position: Card['position']) => void
      >,
      required: true,
    },
    updateZindex: {
      type: Function as PropType<
        (cardId: Card['cardId'], zIndex: Card['zIndex']) => void
      >,
      required: true,
    },
    sidebarWidth: {
      type: Number as PropType<number>,
      required: true,
    },
    roomId: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    const ctx = useContext()
    const onClick = () => props.add()
    const maxZindex = ref(0)
    props.cards.map((card) => {
      if (card.zIndex > maxZindex.value) {
        maxZindex.value = card.zIndex
      }
    })
    const addZindex = () => {
      maxZindex.value = maxZindex.value + 1
    }
    const getZindex = () => {
      return maxZindex.value
    }
    return () => (
      <div class={[styles.boardContainer, imageStyles[props.roomId]]}>
        {props.cards.map((card) => (
          <div
            onMousedown={() => {
              addZindex()
            }}
          >
            <StickyCard
              key={card.cardId}
              getZindex={getZindex()}
              card={card}
              input={(text) => props.input(card.cardId, text)}
              delete={() => props.delete(card.cardId)}
              updatePosition={(position) =>
                props.updatePosition(card.cardId, position)
              }
              updateZindex={(zIndex) => props.updateZindex(card.cardId, zIndex)}
              sidebarWidth={props.sidebarWidth}
            />
          </div>
        ))}
        <button class={styles.addCardButton} onClick={onClick}>
          +
        </button>
      </div>
    )
  },
})
