export const useUserStore = defineStore('user', {
  state: () => ({
    usersProd: [] as string[],
  }),
  actions: {
    async getUsers() {
      if (this.usersProd.length === 0) {
        const { getUsersProd } = useMyFetch();
        const data: string[] | unknown = await getUsersProd();
        if (!Array.isArray(data)) {
          return [];
        }
        this.usersProd = data.map((item: any) => item.username).sort();
      }
      return this.usersProd;
    }
  }
})