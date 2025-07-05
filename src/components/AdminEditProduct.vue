<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="font-display text-3xl font-light text-brown-900">
        Uredi <span class="text-gold-600">proizvod</span>
      </h1>
      <router-link
        to="/admin/products"
        class="btn-secondary"
      >
        ← Natrag na proizvode
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-brown-200 border-t-brown-800 mx-auto"></div>
      <p class="mt-6 font-display text-brown-600">Učitavanje proizvoda...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6">
      <div class="flex items-center">
        <div class="text-red-400 text-2xl mr-3">⚠️</div>
        <div>
          <h3 class="font-display text-lg font-medium text-red-800">Greška pri učitavanju</h3>
          <p class="text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>
      <div class="mt-4">
        <button @click="loadProduct" class="btn-primary">
          Pokušaj ponovo
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else-if="product" class="bg-white rounded-2xl shadow-elegant border border-brown-100 p-8">
      <form @submit.prevent="updateProduct" class="space-y-8">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Naziv proizvoda *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="form-input"
              placeholder="Unesite naziv proizvoda"
            />
          </div>
          
          <div>
            <label class="form-label">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              class="form-input"
              placeholder="Unesite SKU kod"
            />
          </div>
        </div>

        <div>
          <label class="form-label">Opis proizvoda</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="form-textarea"
            placeholder="Unesite detaljan opis proizvoda"
          ></textarea>
        </div>

        <!-- Pricing -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Cijena (EUR) *</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="form-input"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label class="form-label">Originalna cijena (EUR)</label>
            <input
              v-model.number="form.originalPrice"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Categories -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="form-label">Brend *</label>
            <select
              v-model="form.brand"
              required
              class="form-select"
            >
              <option value="">Odaberite brend</option>
              <option v-for="brand in brands" :key="brand.name" :value="brand.name">
                {{ brand.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Kategorija *</label>
            <select
              v-model="form.category"
              required
              class="form-select"
            >
              <option value="">Odaberite kategoriju</option>
              <option v-for="category in categories" :key="category.name" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Podkategorija</label>
            <select
              v-model="form.subcategory"
              class="form-select"
            >
              <option value="">Odaberite podkategoriju</option>
              <option v-for="subcategory in subcategories" :key="subcategory.name" :value="subcategory.name">
                {{ subcategory.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Specifications -->
        <div>
          <label class="form-label">Specifikacije</label>
          <div class="space-y-3">
            <div v-for="(spec, index) in form.specifications" :key="index" class="flex gap-3">
              <input
                v-model="spec.key"
                type="text"
                class="form-input flex-1"
                placeholder="Naziv specifikacije"
              />
              <input
                v-model="spec.value"
                type="text"
                class="form-input flex-1"
                placeholder="Vrijednost"
              />
              <button
                type="button"
                @click="removeSpecification(index)"
                class="px-3 py-2 text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                🗑️
              </button>
            </div>
            <button
              type="button"
              @click="addSpecification"
              class="text-gold-600 hover:text-gold-800 transition-colors duration-300"
            >
              ➕ Dodaj specifikaciju
            </button>
          </div>
        </div>

        <!-- Images -->
        <div>
          <label class="form-label">Slike proizvoda</label>
          <div class="space-y-3">
            <!-- File Upload -->
            <div 
              class="border-2 border-dashed border-brown-300 rounded-lg p-6 text-center transition-colors duration-300"
              :class="{ 'border-gold-500 bg-gold-50': isDragOver }"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileUpload"
                class="hidden"
              />
              <div class="space-y-2">
                <div class="text-4xl text-brown-400">📷</div>
                <p class="text-brown-600">Kliknite za odabir slika ili ih prevucite ovdje</p>
                <p class="text-sm text-brown-500">Podržani formati: JPG, PNG, GIF. Maksimalna veličina: 5MB po slici</p>
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="btn-secondary"
                >
                  Odaberi slike
                </button>
              </div>
            </div>
            
            <!-- Uploaded Images Preview -->
            <div v-if="form.images.length > 0" class="space-y-3">
              <h4 class="font-medium text-brown-800">Odabrane slike:</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in form.images"
                  :key="index"
                  class="relative group"
                >
                  <div class="aspect-square bg-brown-100 rounded-lg overflow-hidden">
                    <img
                      :src="image.url"
                      :alt="image.alt || 'Slika proizvoda'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="opacity-0 group-hover:opacity-100 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 transition-all duration-300"
                      title="Ukloni sliku"
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    v-model="image.alt"
                    type="text"
                    class="mt-2 w-full text-xs px-2 py-1 border border-brown-200 rounded"
                    placeholder="Alt tekst"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Garancija</label>
            <input
              v-model="form.warranty"
              type="text"
              class="form-input"
              placeholder="npr. 2 godine"
            />
          </div>
          
          <div>
            <label class="form-label">Tagovi</label>
            <input
              v-model="form.tags"
              type="text"
              class="form-input"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Status</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="form.inStock"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2">Na stanju</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2">Izdvojen proizvod</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-brown-200">
          <router-link
            to="/admin/products"
            class="btn-secondary"
          >
            Odustani
          </router-link>
          <button
            type="submit"
            :disabled="saving"
            class="btn-primary"
          >
            {{ saving ? 'Spremam...' : 'Spremi promjene' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message.show" class="fixed bottom-4 right-4 z-50">
      <div 
        :class="[
          'p-4 rounded-lg shadow-lg',
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]"
      >
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '../services/api.js'

export default {
  name: 'AdminEditProduct',
  data() {
    return {
      product: null,
      loading: true,
      saving: false,
      error: null,
      categories: [],
      brands: [],
      subcategories: [],
      form: {
        name: '',
        sku: '',
        description: '',
        price: 0,
        originalPrice: null,
        brand: '',
        category: '',
        subcategory: '',
        specifications: [],
        images: [],
        warranty: '',
        tags: '',
        inStock: true,
        featured: false
      },
      message: {
        show: false,
        type: 'success',
        text: ''
      },
      isDragOver: false
    }
  },
  async mounted() {
    await this.loadInitialData();
    await this.loadProduct();
  },
  methods: {
    async loadInitialData() {
      try {
        const [categoriesRes, brandsRes, subcategoriesRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getBrands(),
          apiService.getSubcategories()
        ]);
        
        this.categories = categoriesRes;
        this.brands = brandsRes;
        this.subcategories = subcategoriesRes;
      } catch (error) {
        console.error('Greška pri učitavanju početnih podataka:', error);
      }
    },

    async loadProduct() {
      this.loading = true;
      this.error = null;
      
      try {
        const productId = this.$route.params.id;
        this.product = await apiService.getProduct(productId);
        this.mapProductToForm();
      } catch (error) {
        console.error('Greška pri učitavanju proizvoda:', error);
        this.error = 'Greška pri učitavanju proizvoda. Provjerite je li proizvod dostupan.';
      } finally {
        this.loading = false;
      }
    },

    mapProductToForm() {
      this.form = {
        name: this.product.name || '',
        sku: this.product.sku || '',
        description: this.product.description || '',
        price: this.product.price || 0,
        originalPrice: this.product.original_price || this.product.originalPrice || null,
        brand: this.product.brand || '',
        category: this.product.category || '',
        subcategory: this.product.subcategory || '',
        specifications: this.parseSpecifications(this.product.specifications),
        images: this.parseImages(this.product.images),
        warranty: this.product.warranty || '',
        tags: this.parseTags(this.product.tags),
        inStock: this.product.in_stock !== undefined ? this.product.in_stock : this.product.inStock !== undefined ? this.product.inStock : true,
        featured: this.product.featured || false
      };
    },

    parseSpecifications(specs) {
      if (!specs) return [];
      if (Array.isArray(specs)) return specs;
      if (typeof specs === 'object') {
        return Object.entries(specs).map(([key, value]) => ({ key, value }));
      }
      return [];
    },

    parseImages(images) {
      if (!images) return [];
      if (Array.isArray(images)) {
        return images.map(img => ({
          url: typeof img === 'string' ? img : img.url || '',
          alt: typeof img === 'string' ? '' : img.alt || ''
        }));
      }
      return [];
    },

    parseTags(tags) {
      if (!tags) return '';
      if (Array.isArray(tags)) return tags.join(', ');
      if (typeof tags === 'string') return tags;
      return '';
    },

    addSpecification() {
      this.form.specifications.push({ key: '', value: '' });
    },

    removeSpecification(index) {
      this.form.specifications.splice(index, 1);
    },

    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
      // Reset file input
      event.target.value = '';
    },

    handleDrop(event) {
      this.isDragOver = false;
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },

    processFiles(files) {
      files.forEach(file => {
        // Provjeri da li je slika
        if (!file.type.startsWith('image/')) {
          this.showMessage('Molimo odaberite samo slike (JPG, PNG, GIF, itd.)', 'error');
          return;
        }

        // Provjeri veličinu (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showMessage('Slika je prevelika. Maksimalna veličina je 5MB.', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.images.push({
            url: e.target.result,
            alt: file.name.replace(/\.[^/.]+$/, '') // Remove file extension for alt text
          });
        };
        reader.readAsDataURL(file);
      });
    },

    removeImage(index) {
      this.form.images.splice(index, 1);
    },

    async updateProduct() {
      this.saving = true;
      
      try {
        // Prepare data for API
        const productData = {
          name: this.form.name,
          sku: this.form.sku,
          description: this.form.description,
          price: this.form.price,
          original_price: this.form.originalPrice,
          brand: this.form.brand,
          category: this.form.category,
          subcategory: this.form.subcategory,
          specifications: this.form.specifications.reduce((acc, spec) => {
            if (spec.key && spec.value) {
              acc[spec.key] = spec.value;
            }
            return acc;
          }, {}),
          images: this.form.images.filter(img => img.url).map(img => ({
            url: img.url,
            alt: img.alt || ''
          })),
          warranty: this.form.warranty,
          tags: this.form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          in_stock: this.form.inStock,
          featured: this.form.featured
        };

        await apiService.updateProduct(this.product._id || this.product.id, productData);
        
        this.showMessage('Proizvod je uspješno ažuriran', 'success');
        
        // Redirect to products list after a short delay
        setTimeout(() => {
          this.$router.push('/admin/products');
        }, 1500);
        
      } catch (error) {
        console.error('Greška pri ažuriranju proizvoda:', error);
        this.showMessage('Greška pri ažuriranju proizvoda', 'error');
      } finally {
        this.saving = false;
      }
    },

    showMessage(text, type = 'success') {
      this.message = {
        show: true,
        type,
        text
      };
      
      setTimeout(() => {
        this.message.show = false;
      }, 3000);
    }
  }
}
</script> 