import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRoute,
  PropType,
} from '@nuxtjs/composition-api'
import styles from './styles.module.css'
import type { Room, Card } from '~/api/@types'
import { Board } from '~/components/Board'
import { Sideber } from '~/components/Sideber'

export type OptionalQuery = {
  roomId: number
  potision: number
}

export default defineComponent({
  props: {
    movedata: {
      type: Function as PropType<(position: number) => void>,
      required: true,
    }
  },
  setup(props) {
    const ctx = useContext()
    const rooms = ref<Room[]>()
    const route = useRoute()
    console.log(props.movedata)
    const roomId = computed(() => {
      const { roomId } = route.value.query
      return isNaN(+roomId) ? undefined : +roomId
    })
    console.log('roomID =', roomId.value)

    onMounted(async () => {
      rooms.value = await ctx.$api.rooms.$get()
    })
    const updateCardText = async (cardId: Card['cardId'], text: string) => {
      const validateRoomId = roomId.value
      if (validateRoomId === undefined) return
      console.log(text)
      await ctx.$api.rooms
        ._roomId(validateRoomId)
        .cards._cardId(cardId)
        .$patch({ body: { text } })

      rooms.value = await ctx.$api.rooms.$get()
      console.log(rooms.value)
    }

    const addCard = async () => {
      const validateRoomId = roomId.value
      if (validateRoomId === undefined) return
      await ctx.$api.rooms._roomId(validateRoomId).cards.$post()

      rooms.value = await ctx.$api.rooms.$get()
      // console.log(rooms.value)
    }
    const deleteCard = async (cardId: Card['cardId']) => {
      const validateRoomId = roomId.value
      if (validateRoomId === undefined) return
      await ctx.$api.rooms
        ._roomId(validateRoomId)
        .cards._cardId(cardId)
        .$delete()

      rooms.value = await ctx.$api.rooms.$get()
    }
    const chanege = async (cardId: Card['cardId'], position: Card['position']) => {
      const validateRoomId = roomId.value
      console.log(position)
      if (validateRoomId === undefined) return
      await ctx.$api.rooms
        ._roomId(validateRoomId)
        .cards._cardId(cardId)
        .$patch({ body: { position }})

        rooms.value = await ctx.$api.rooms.$get()
        console.log(rooms.value)
    }

    return () => 
      rooms.value ? (
        <div class={styles.container}>
          <div class={styles.sideberwrapper}>
            {rooms.value && <Sideber rooms={rooms.value} />}
          </div>
          <div class={styles.boardwrapper}>
            {roomId.value !== undefined && (
                <Board
                  cards={rooms.value[roomId.value].cards}
                  input={updateCardText}
                  add={addCard}
                  delete={deleteCard}
                  movedate={chanege}
              />
            )}
          </div>
        </div>
      ) : (
        <div> Loading... </div>
      )
    },
})
