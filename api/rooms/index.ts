import { mockMethods } from "aspida-mock";

export type Room = {
    roomId: number
    roomName: string
    color: string
}

export type Methods = {
    get: {
        resBody: Room[]
    }
}

const rooms: Room[] = [
    { roomId: 0, roomName: 'room', color: 'red' },
    { roomId: 1, roomName: 'room', color: 'blue' },
    { roomId: 2, roomName: 'room', color: 'green' },
]

export default mockMethods<Methods>({
    get: ()=> ({ status: 200, resBody: rooms}),
})