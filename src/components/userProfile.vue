<template>
  <div class="user-profile">
      <div class="profile-img-container" @click="editProfileImage">
          <!-- Exibe a imagem se o caminho estiver definido -->
          <img :src="profileImage" alt="Profile Image" class="profile-img" v-if="profileImage" />
          <input
              type="file"
              ref="fileInput"
              class="hidden"
              @change="uploadImage"
              accept="image/*"
          />
      </div>
      <h2 v-if="username">{{ username }}</h2>
      <h2 v-else>Usuário não encontrado</h2>
      <p>{{ followersCount }} seguidores</p>
      <div>
          <p v-if="!isEditingBio">{{ bio || 'Escreva sobre você' }}</p>
          <div v-if="isEditingBio">
              <textarea v-model="newBio" maxlength="300"></textarea>
              <div class="buttons">
                  <button @click="confirmEditBio">Confirmar</button>
                  <button @click="cancelEditBio">Cancelar</button>
              </div>
          </div>
          <button v-if="!isEditingBio" @click="editBio">Editar Biografia</button>
      </div>
  </div>
</template>

<script>
import api from '@/services/axiosConfig'

export default {
  data() {
      return {
          profileImage: null,  // Inicializa como null
          username: '',
          bio: '',
          newBio: '',
          isEditingBio: false,
          followersCount: 0
      }
  },
  methods: {
      editProfileImage() {
          this.$refs.fileInput.click()
      },
      async uploadImage(event) {
          const file = event.target.files[0]
          if (file) {
              const formData = new FormData()
              formData.append('profile_image', file)

              try {
                  const userId = localStorage.getItem('user_id')
                  const response = await api.patch(`/users/${userId}/`, formData, {
                      headers: {
                          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                          'Content-Type': 'multipart/form-data'
                      }
                  })
                  this.profileImage = response.data.profile_image  // Garante que a URL da imagem seja recebida diretamente
              } catch (error) {
                  console.error('Erro ao fazer upload da imagem.', error)
              }
          }
      },
      editBio() {
          this.isEditingBio = true
          this.newBio = this.bio
      },
      async confirmEditBio() {
          if (this.newBio.length > 300) {
              console.error('Biografia excede o limite de 300 caracteres.')
              return
          }

          try {
              const userId = localStorage.getItem('user_id')
              const response = await api.patch(`/users/${userId}/`, { bio: this.newBio }, {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      'Content-Type': 'application/json'
                  }
              })
              this.bio = response.data.bio
              this.isEditingBio = false
          } catch (error) {
              console.error('Erro ao atualizar biografia.', error)
          }
      },
      cancelEditBio() {
          this.isEditingBio = false
      }
  },
  async mounted() {
      try {
          const userId = localStorage.getItem('user_id')
          if (!userId) {
              console.error('ID do usuário não encontrado no localStorage')
              return
          }

          const response = await api.get(`/users/${userId}/`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
          })

          if (response.data) {
              this.username = response.data.username || 'Usuário não encontrado'
              this.bio = response.data.bio || 'Escreva sobre você'
              this.profileImage = response.data.profile_image  // Carrega a URL da imagem diretamente do back-end
              this.followersCount = response.data.followers_count || 0
          } else {
              console.error('Dados do usuário não encontrados na resposta da API')
          }
      } catch (error) {
          console.error('Erro ao carregar perfil.', error)
      }
  }
}
</script>

<style scoped>
.user-profile {
  text-align: center;
}
.profile-img-container {
  cursor: pointer;
}
.profile-img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.hidden {
  display: none;
}
textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  resize: none;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
button {
  margin-top: 10px;
}
</style>
