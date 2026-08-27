<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CardWindowHeader from '../global/CardWindowHeader.vue';

const { t } = useI18n();
</script>
<template>

    <div class="container-style-dark ">
        <CardWindowHeader title="System_Profile" />

        <div class="p-4 space-y-3 text-sm text-pink-100 leading-relaxed">
            <p v-html="t('home.aboutFirst')" />

            <p v-html="t('home.aboutSecond')" />

            <p>{{ t("home.aboutThird") }}</p>
        </div>
    </div>
</template>
