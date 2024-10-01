<template>
    <div>
        <h1>Sign Up</h1>
        <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
        <router-link to="/">Login</router-link>
    </div>
</template>

<script>
export default {
    name: 'SignUpForm',
};
</script>
