<template>
    <div class="p-EmailView">

        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>

        <div class="p-EmailView-message">
          <span>
            Please check your email. We've sent a verification link to your inbox.
            Please check spam or all folder.
          </span>
        </div>
    </div>
</template>

<script setup>


</script>

<style lang="css" scoped>
.p-EmailView {
    border-radius: var(--radius-c);
    font-size: var(--text-size-4);
    text-align: center;
    font-weight: 400;
    padding: 1rem;
}

.p-EmailView-message{

}
</style>