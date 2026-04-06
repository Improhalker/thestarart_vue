<script setup>
import Blog from '../global/blog/Blog.vue';
import About from './About.vue';
import Thought from './Thought.vue';
import CsGallery from './CsGallery.vue';
</script>
<template>
    <div class="flex flex-col gap-6">
        
        <Thought />

        <CsGallery />

        <Blog />

        <About />
        
    </div>
</template>