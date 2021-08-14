import {
  defineComponent,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import type { Room } from '~/api/rooms'
import { Rooms } from '~/components/Rooms'
import styles from '~/components/styles.module.css'

export default defineComponent({
  setup() {
    const ctx = useContext()
    const rooms = ref<Room[]>()

    onMounted(async () => {
      rooms.value = await ctx.$api.rooms.$get()
    })

    return () => (
      <div class={styles.page}>
        {rooms.value && <Rooms rooms={rooms.value} />}
      </div>
    )
  },
})
