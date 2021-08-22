import {
  defineComponent,
  PropType,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import type { Card } from '~/api/@types'
import styles from '~/components/styles.module.css'
import { StickyCard } from './StickyCard'

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
  },
  setup(props) {
    const ctx = useContext()
    const onClick = () => props.add()
    const maxZindex = ref(0)
    const clickedCardId = ref()
    props.cards.map((card) => {
      if (card.zIndex > maxZindex.value) {
        maxZindex.value = card.zIndex
      }
    })
    const onMousedown = (CardId: number) => {
      clickedCardId.value = CardId
    }
    const getZindex = (CardId: number) => {
      // props.cards.map((card) => {
      console.log('check')
      if (props.cards[CardId].cardId === clickedCardId.value) {
        maxZindex.value = maxZindex.value + 1
      }
      // })
      return maxZindex.value
    }
    return () => (
      <div class={styles.boardContainer}>
        {props.cards.map((card) => (
          <div onMousedown={() => onMousedown(card.cardId)}>
            <StickyCard
              key={card.cardId}
              getZindex={getZindex(card.cardId)}
              card={card}
              input={(text) => props.input(card.cardId, text)}
              delete={() => props.delete(card.cardId)}
              updatePosition={(position) =>
                props.updatePosition(card.cardId, position)
              }
              updateZindex={(zIndex) => props.updateZindex(card.cardId, zIndex)}
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
