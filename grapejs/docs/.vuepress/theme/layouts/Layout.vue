<template>
  <Layout>
    <StudioSdkBannerSidebar slot="sidebar-top" />
  </Layout>
</template>

<script>
// var Layout = require('@vuepress/theme-vue/layouts/Layout.vue').default;
// var CarbonAds = require('./CarbonAds.vue').default;
// import Layout from '@vuepress/theme-default/layouts/Layout.vue';
// import CarbonAds from './CarbonAds.vue';

// Check all the default slots:
// https://github.com/vuejs/vuepress/blob/9fb4bb00925d9409e6732118e996411c6a82c85d/packages/%40vuepress/theme-default/layouts/Layout.vue
import Layout from '@parent-theme/layouts/Layout.vue';
import CarbonAds from './CarbonAds.vue';
import StudioSdkBannerSidebar from './StudioSdkBannerSidebar.vue';

export default {
  components: {
    Layout,
    StudioSdkBannerSidebar,
  },
};
</script>
