import PocketBase from 'pocketbase'

const VITE_POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL

export const pb = new PocketBase(VITE_POCKETBASE_URL)
