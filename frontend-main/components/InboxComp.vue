<template>
  <div class="InboxComp" ref="wrapperRef">
    <div @click="toggle">
      <slot />
    </div>

    <transition name="fade-slide">
      <div class="InboxComp-body" v-if="props.modelValue">
        <div class="notification-empty" v-if="props.notifications.length === 0">
          No notifications
        </div>
        <ul v-else class="InboxComp-box">
          <div class="notification-header">
            <span>Notifications</span>
            <span>You have {{ props.notifications.length }} notifications today.</span>
          </div>

          <li class="notification-item" v-for="(n, i) in props.notifications" :key="i">

            <div class="notification-content">
              <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-mail-icon lucide-mail">
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              </div>
              <div class="notification-message">
                <p class="title">{{ n.title }}</p>

                <span class="message">{{ n.message }}</span>

                <span class="date">
                  {{ formatWithDateFns(n.created_at) }}
                </span>

              </div>

            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>

</template>

<script setup>

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};

const wrapperRef = ref(null);

onClickOutside(wrapperRef, () => {
  if (props.modelValue) {
    emit('update:modelValue', false)
  }
})
</script>

<style scoped>
.InboxComp {
  position: relative;
  display: inline-block;
}

.InboxComp-body {
  border: 1px solid var(--border-b);
  background: var(--background-a);
  border-radius: var(--radius-b);
  box-shadow: var(--shadow-e);
  box-sizing: border-box;
  color: var(--text-a);
  position: absolute;
  margin-top: 1rem;
  padding: 0.5rem;
  right: 0;
  top: 100%;
  width: 375px;
  z-index: 14000;
  overflow-y: auto;
  max-height: 600px;
}

.notification-empty {
  padding: 1rem;
  text-align: center;
  color: var(--text-b);
  font-size: var(--text-size-1);
}

.InboxComp-box {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-item {
  width: 100%;
  display: flex;
  padding: 1rem;
  cursor: pointer;
  box-sizing: border-box;
  flex-direction: column;
  border-top: 1px solid var(--border-a);
}

.title {
  margin: 0;
  font-weight: bold;
  font-size: var(--text-size-1);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  transition: var(--transition-a);
}

.notification-item:hover {
  background: var(--background-b);
}

.notification-message {
  display: flex;
  margin-left: 1rem;
  flex-direction: column;
}

.message {
  font-size: var(--text-size-0);
  line-height: 1.5rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.date {
  font-size: var(--text-size-0);
  color: var(--text-b);
  margin-top: 0.5rem;
  font-weight: 400;
}

.icon {
  display: flex;
  align-items: center;
  color: var(--text-w);
  justify-content: center;
  border-radius: var(--radius-f);
  background: var(--primary-a);
  padding: 0.5rem;
}

.notification-header {
  display: flex;
  padding: 1rem;
  box-sizing: border-box;
  flex-direction: column;
}

.notification-header span:nth-child(1) {
  font-size: var(--text-size-2);
  font-weight: bold;
}

.notification-header span:nth-child(2) {
  font-size: var(--text-size-0);
  color: var(--text-b);
  margin-top: 0.25rem;
  font-weight: 400;
}
</style>