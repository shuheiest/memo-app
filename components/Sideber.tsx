import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import type { Room } from '~/api/@types'
import styles from '~/components/styles.module.css'

export const Sideber = defineComponent({
  props: {
    rooms: {
      type: Array as PropType<Room[]>,
      required: true,
    },
    sidebarWidth: {
      type: Number as PropType<Number>,
      required: true,
    },
  },
  setup(props) {
    const ctx = useContext()
    return () => (
      <div class={styles.sidebar} style={{ width: `${props.sidebarWidth}px` }}>
        {props.rooms.map((room) => (
          <nuxt-link
            key={room.roomId}
            to={ctx.$pagesPath.$url({ query: { roomId: room.roomId } })}
          >
            <div
              class={styles.room}
              key={room.roomId}
              style={{ color: room.color }}
            >
              {room.roomName}
            </div>
          </nuxt-link>
        ))}
      </div>
    )
  },
})
