let database: IDBDatabase | null = null
const request = indexedDB.open('plan', 1)

request.onerror = () => {
  console.error('为什么不允许我的 web 应用使用 IndexedDB！')
}
request.onsuccess = () => {
  database = request.result
}

export { database }
