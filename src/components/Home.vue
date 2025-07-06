<template>
  <div class="home min-h-screen">
    <!-- Minimalistički Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brown-50 to-brown-100">
      <!-- Suptilni dekorativni elementi -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-1/4 right-1/4 w-32 h-32 bg-gold-400 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gold-300 rounded-full blur-3xl"></div>
      </div>

      <!-- Glavni sadržaj -->
      <div class="relative z-10 container-max text-center px-8">
        <div class="animate-fade-in-up">
          <!-- Glavni naslov -->
          <h1 class="font-display text-6xl lg:text-8xl font-light mb-8 text-brown-900 leading-tight">
            Mobili 
            <span class="text-gold-600 font-normal">più</span>
          </h1>
          
          <!-- Suptilan podnaslov -->
          <p class="font-display text-xl lg:text-2xl text-brown-700 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Prodaja i kompletno opremanje vašeg doma
          </p>

          <!-- Minimalistički CTA dugmad -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <router-link 
              to="/proizvodi" 
              class="inline-flex items-center px-12 py-4 text-lg font-display font-medium text-white bg-brown-800 rounded-full shadow-warm hover:bg-brown-900 transition-all duration-300 transform hover:-translate-y-1"
            >
              Pogledaj kolekciju
            </router-link>
            
            <router-link 
              to="/kontakt" 
              class="inline-flex items-center px-12 py-4 text-lg font-display font-medium text-brown-800 border-2 border-brown-300 rounded-full hover:border-brown-400 hover:bg-brown-50 transition-all duration-300"
            >
              Kontaktiraj nas
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Minimalistička sekcija kategorija -->
    <section class="py-24 bg-white">
      <div class="container-max">
        <div class="text-center mb-20">
          <h2 class="font-display text-4xl lg:text-5xl font-light text-brown-900 mb-6">
            Naše <span class="text-gold-600">specijalnosti</span>
          </h2>
          <p class="text-lg text-brown-600 max-w-2xl mx-auto">
            Pažljivo odabrane kategorije za vaš dom
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="group text-center p-8 rounded-2xl bg-brown-50 hover:bg-brown-100 transition-all duration-300 border border-brown-100 hover:border-brown-200"
          >
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white shadow-sm mb-6 group-hover:shadow-md transition-shadow duration-300">
              <span class="text-2xl">{{ category.icon }}</span>
            </div>
            
            <h3 class="font-display text-xl font-medium text-brown-900 mb-4">
              {{ category.name }}
            </h3>
            
            <p class="text-brown-600 mb-6 leading-relaxed">
              {{ category.description }}
            </p>
            
            <router-link 
              :to="`/proizvodi?category=${encodeURIComponent(category.name)}`"
              class="inline-flex items-center font-display font-medium text-gold-700 hover:text-gold-800 transition-colors duration-300"
            >
              Pogledaj
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      categories: [
        {
          name: 'Bijela tehnika',
          icon: '🏠',
          description: 'Hladnjaci, perilice, štednjaci i ostala velika kućanska tehnika'
        },
        {
          name: 'Mali aparati',
          icon: '☕',
          description: 'Aparati za kavu, tosteri, blenderi i ostali kućanski pomagači'
        },
        {
          name: 'Namještaj',
          icon: '🪑',
          description: 'Kuhinjski namještaj i kompletna prostorna rješenja'
        }
      ]
    }
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 