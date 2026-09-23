<script setup lang="ts">
const {
  login, // login method, accepts username and password
  logout, // performing a logout
  errors, // errors from API prefixed with a method name, which is the source of the problem
  isLoggedIn, // flag that says if customer is logged in
  user, // the whole customer object
} = useUser();

const invokeLogin = () => login(loginCredentials);
</script>
...
