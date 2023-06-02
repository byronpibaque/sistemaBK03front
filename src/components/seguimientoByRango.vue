<template>
  <v-layout align-start>
      <v-flex>
      <v-toolbar flat color="white" >
          <v-toolbar-title>Seguimiento Por Rango de Fechas</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
                 
          </v-toolbar>
       
          <v-container grid-list-sm class="pa-4 white" >
            <v-form @submit.prevent="submit">
              <v-layout row wrap>  
                  <v-flex xs12 sm5 md5  v-if="$store.state.usuario.codigoFarmacia==undefined">
                    <v-autocomplete v-model="formBusqueda.codigoInventario" :items="listInventarios"
                      label="Inventario">
                    </v-autocomplete>
                  </v-flex>  

                  <v-flex xs12 sm12 md12 lg12 xl12></v-flex>

                  <v-flex xs6 sm6 md5 lg5 x6>
                    <v-text-field v-model.trim="formBusqueda.codigo_producto" label="Código de barras" 
                      required>
                    </v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 xl12></v-flex>

                  <v-flex xs12 sm3 md3>
                    <v-menu v-model="menu2" :close-on-content-click="false"
                      :nudge-right="40" lazy transition="scale-transition"
                      offset-y full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field v-model="formBusqueda.fecha_inicio" label="Fecha de Inicio"
                          prepend-icon="event" readonly v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="formBusqueda.fecha_inicio" required
                        @input="menu2 = false">
                      </v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12 sm3 md3 class="ml-5">
                    <v-menu v-model="menu" :close-on-content-click="false"
                      :nudge-right="40" lazy transition="scale-transition"
                      offset-y full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field v-model="formBusqueda.fecha_fin" label="Fecha de Finalización"
                          prepend-icon="event" readonly v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="formBusqueda.fecha_fin" required
                        @input="menu = false">
                      </v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-btn type="submit" color="success" class="ml-4 mt-3">Buscar</v-btn>
              </v-layout>
            </v-form>
          </v-container>
      </v-flex>
  </v-layout>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: 'seguimientoByRango',
      data(){
          return{
            listInventarios: [],
            formBusqueda: {
              fecha_inicio: '',
              fecha_fin: '',
              codigo_producto: '',
              inventario_id: ''
            },
            menu: false,
            menu2: false,
            modal: false,
            date: new Date().toISOString().substr(0, 10)
          }            
      },
      methods: { 
        buscarProducto(){
          console.log("object");
        },
        getInventarios() {
          let me = this;
          let header = { Token: this.$store.state.token };
          let configuracion = { headers: header };
          axios.get("inventario/list", configuracion).then(function ({ data }) {
              data.map(function (x) {
                if (x.estado) me.listInventarios.push({ text: x.descripcion, value: x._id });
              });
          }).catch(function (error) {
            console.log(error);
          });
        },
        submit(){
          axios.post('/seguimiento').then( response => {
            console.log( response.data );
          })
        }
      },
      mounted() {
        this.getInventarios()
      }
  }
  </script>
  
  <style scoped>
  
  </style>