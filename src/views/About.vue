<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h1>
    </div>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              G
            </div>
          </div>
          
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Hello, I'm Grummans! 👋
            </h2>
            
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              I'm a passionate developer and technology enthusiast with a love for creating 
              innovative solutions and sharing knowledge with the community. This blog is my 
              digital space where I explore the latest trends in web development, share 
              tutorials, and document my journey in the ever-evolving world of technology.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              What I Do
            </h3>
            
            <ul class="text-gray-600 dark:text-gray-400 mb-6 space-y-2">
              <li>• Frontend Development with Vue.js, React, and TypeScript</li>
              <li>• Backend Development with Node.js and Python</li>
              <li>• Cloud Architecture and DevOps practices</li>
              <li>• Technical Writing and Community Engagement</li>
              <li>• Open Source Contributions</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Technologies I Love
            </h3>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="tech in technologies" :key="tech" class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                {{ tech }}
              </span>
            </div>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Let's Connect
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              I'm always excited to connect with fellow developers, discuss new technologies, 
              or collaborate on interesting projects. Feel free to reach out!
            </p>

            <div class="flex space-x-4">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <component :is="social.icon" class="w-5 h-5 mr-2" />
                {{ social.name }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Why I Write
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Writing has always been a way for me to crystallize my thoughts and share knowledge 
          with the broader community. Through this blog, I aim to create content that not only 
          helps other developers in their journey but also serves as a reference for my own 
          learning. Every post is an opportunity to dive deep into a topic, explore new concepts, 
          and contribute to the collective knowledge of our industry.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const technologies = [
  'Vue.js', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 
  'TailwindCSS', 'Docker', 'AWS', 'Git', 'MongoDB', 'PostgreSQL'
]

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'IconGitHub'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'IconTwitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'IconLinkedIn'
  },
  {
    name: 'Email',
    url: 'mailto:hello@example.com',
    icon: 'IconEmail'
  }
]

// Simple icon components
const IconGitHub = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  `
}

const IconTwitter = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  `
}

const IconLinkedIn = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  `
}

const IconEmail = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
  `
}
</script>
