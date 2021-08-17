import { defineComponent, PropType, computed, ref } from "@nuxtjs/composition-api"
import type { Card } from '~/api/@types'
import styles from '~/components/styles.module.css'
import {DragHandler} from './DragHandler'

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
        movedate: {
            type: Function as PropType<(position: Card['position']) => void>,
            required: true,
        },
        delete: { type: Function as PropType<() => void>, required: true },
    },
    setup(props) {
        const isForcusing = ref(false)
        const localtext = ref(props.card.text)
        const text = computed(() =>
        isForcusing.value ? localtext.value : props.card.text
        )
        const onInput = ({ target }: Event) => {
        if (!(target instanceof HTMLTextAreaElement)) return
        localtext.value = target.value
        props.input(target.value)
        }
        const onFocus = () => (isForcusing.value = true)
        const onBlur = () => (isForcusing.value = false)

        return () => (
            <div
                class={styles.cardContainer}
                style= {{
                    top: `${props.card.position.y}px`,
                    left: `${props.card.position.x}px`,
                    backgroundColor: props.card.color,
                }}
                >
                <DragHandler
                    card={props.card}
                    delete={() => props.delete() }
                    input={props.input}
                    movedata={(position) => props.movedate(position)}
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
        )
    },
})