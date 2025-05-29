<script lang="ts" setup>
const router = useRouter();
const { logUserOut } = useAuthStore();
logUserOut();
router.push('/login');
</script>
