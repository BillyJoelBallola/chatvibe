import { serverTimestamp } from 'firebase/firestore'

export type MemberType = { id: string; displayName: string; email: string }

export type RoomType = {
  id: string
  name: string
  admin: MemberType
  members: MemberType[]
  createdAt: typeof serverTimestamp
}
