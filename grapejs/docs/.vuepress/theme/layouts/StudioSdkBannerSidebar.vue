<template>
  <a class="banner-sdk-sidebar" :href="getSdkDocsLink()">
    <h2 class="banner-sdk-sidebar__title">Supercharge Your GrapesJS Development 🚀</h2>
    <img class="banner-sdk-sidebar__image" :src="$withBase('/studio-banner.jpg')" alt="Studio SDK" />
    <p class="banner-sdk-sidebar__content">
      Studio SDK is the next-level visual builder with advanced features, custom plugins, and seamless integration. Save
      time and build faster!
    </p>
  </a>
</template>

<script>
import { getSdkDocsLink } from './utils';

export default {
  methods: {
    getSdkDocsLink() {
      return getSdkDocsLink('sidebar');
    },
  },
};
</script>

<style>
.banner-sdk-sidebar {
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 5px;
  color: inherit;
}
.banner-sdk-sidebar__title {
  font-size: 0.8rem;
}
.banner-sdk-sidebar__image {
  border-radius: 3px;
  width: 100%;
  max-width: 150px;
  float: left;
  margin-right: 10px;
}
.banner-sdk-sidebar__content {
  font-size: 0.8rem;
}
</style>
