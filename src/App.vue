<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esJefe || esLider || esVendedor || esSupervisor">
          <v-list-tile :to="{name:'home'}">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Inicio</v-list-tile-title>
          </v-list-tile>
        </template>
        <!-- bodega -->
        <template v-if="esAdministrador || esJefe || esLider || esVendedor || esSupervisor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Bodega</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'categoria'}">
              <v-list-tile-action>
                <v-icon>category</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Categorías</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text" :to="{name: 'presentacion'}">
              <v-list-tile-action>
                <v-icon>present_to_all</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Presentaciones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="cyan--text" :to="{name: 'laboratorio'}">
              <v-list-tile-action>
                <v-icon>group_work</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Laboratorios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-green--text" :to="{name: 'articulo'}">
              <v-list-tile-action>
                <v-icon>store</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Artículos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text" :to="{name: 'vademecum'}">
              <v-list-tile-action>
                <v-icon>class</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Vademécum</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'promocion'}" v-if="esAdministrador || esJefe || esSupervisor">
              <v-list-tile-action>
                <v-icon>redeem</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Promociones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'descuentos'}" >
              <v-list-tile-action>
                <v-icon>local_offer</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Descuentos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
               <v-list-tile class="green--text" :to="{name: 'actualizarinf'}" >
              <v-list-tile-action>
                <v-icon>local_offer</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Actualizaciones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- compras -->
        <template v-if="esAdministrador || esJefe || esLider || esVendedor || esSupervisor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Compras</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'ingreso'}">
              <v-list-tile-action>
                <v-icon>add_shopping_cart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ingresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'proveedor'}">
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Proveedores</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- ventas -->
        <template>
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Ventas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text"  :to="{name: 'venta'}" v-if="!isMobile() || esVendedor">
              <v-list-tile-action>
                <v-icon>point_of_sale</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ventas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="light-blue--text"  :to="{name: 'cotizacion'}">
              <v-list-tile-action>
                <v-icon>receipt</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cotizacion</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text"  :to="{name: 'facturasd'}">
              <v-list-tile-action>
                <v-icon>content_copy</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Facturas Duplicadas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text"  :to="{name: 'egresos'}">
              <v-list-tile-action>
                <v-icon>transit_enterexit</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Egresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="cyan--text" :to="{name: 'cliente'}">
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title >Clientes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-green--text" :to="{name: 'cupo'}" v-if="esAdministrador || esJefe || esSupervisor">
              <v-list-tile-action>
                <v-icon>request_quote</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title >Cupos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'arqueos'}">
              <v-list-tile-action>
                <v-icon>multiline_chart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Arqueos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'transferencias'}">
              <v-list-tile-action>
                <v-icon>swap_horiz</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Transferencias</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>

        </template>
        <!-- Accesos -->
        <template v-if="esAdministrador ">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Accesos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'acceso'}">
              <v-list-tile-action>
                <v-icon>face</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Accesos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text" :to="{name: 'usuario'}">
              <v-list-tile-action>
                <v-icon>supervised_user_circle</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Usuarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="green--text" :to="{name: 'propietarios'}">
              <v-list-tile-action>
                <v-icon>supervised_user_circle</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Propietarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="cyan--text" :to="{name: 'rol'}">
              <v-list-tile-action>
                <v-icon>check_box</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Roles</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'tipodocumento'}">
              <v-list-tile-action>
                <v-icon>article</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Tipos de documentos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-green--text" :to="{name: 'tipocomprobante'}">
              <v-list-tile-action>
                <v-icon>grading</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Tipos de comprobantes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- Establecimientos -->
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Establecimientos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-blue--text" :to="{name: 'farmacias'}">
              <v-list-tile-action>
                <v-icon>local_pharmacy</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Farmacia</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="light-green--text" :to="{name: 'farmacia'}">
              <v-list-tile-action>
                <v-icon>store</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Farmacias</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'inventario'}">
              <v-list-tile-action>
                <v-icon>backup_table</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Inventarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- contabilidad -->
        <template  v-if="esAdministrador || esJefe || esSupervisor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Contabilidad</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile  class="light-green--text" :to="{name: 'ctaCobrar'}">
              <v-list-tile-action>
                <v-icon>insights</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cuentas por cobrar</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile  class="light-blue--text" :to="{name: 'estadisticas'}">
              <v-list-tile-action>
                <v-icon>analytics</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Reportes estadísticos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile  class="orange--text" :to="{name: 'reportes'}">
              <v-list-tile-action>
                <v-icon>leaderboard</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Reportes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
                <v-list-tile  class="light-blue--text" :to="{name: 'rentabilidad'}">
              <v-list-tile-action>
                <v-icon>analytics</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Rentabilidad</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- consultas -->
        <template v-if="esAdministrador || esJefe || esLider || esVendedor || esSupervisor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Consultas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile   class="blue--text" :to="{name: 'seguimiento'}">
              <v-list-tile-action>
                <v-icon>visibility</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Seguimiento a productos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile   class="orange--text" :to="{name: 'consultaingresos'}">
              <v-list-tile-action>
                <v-icon>shop_two</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta Compras</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="orange--text" :to="{name: 'consultadetallesCompras'}">
             <v-list-tile-action>
               <v-icon>search</v-icon>
             </v-list-tile-action>
             <v-list-tile-content>
               <v-list-tile-title>Consulta compras por detalles</v-list-tile-title>
             </v-list-tile-content>
           </v-list-tile>
            <v-list-tile class="light-blue--text" :to="{name: 'ConsultasVentas'}">
              <v-list-tile-action>
                <v-icon>sell</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta Ventas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="blue--text" :to="{name: 'consultadetalles'}">
              <v-list-tile-action>
                <v-icon>search</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta ventas por detalles</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
               <v-list-tile class="pink--text" :to="{name: 'consultadetallesA'}">
              <v-list-tile-action>
                <v-icon>search</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta para reportes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="light-green--text" :to="{name: 'consultaLab'}">
              <v-list-tile-action>
                <v-icon>biotech</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta por Laboratorios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <!-- CONFIGURACIONES -->
        <template v-if="esAdministrador || esJefe || esLider || esVendedor || esSupervisor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Configuracion</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile   class="blue--text" :to="{name: 'cuc'}">
              <v-list-tile-action>
                <v-icon>settings</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cambiar Usuario/Clave</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>     
            <v-list-tile   class="blue--text" :to="{name: 'asignarip'}">
              <v-list-tile-action>
                <v-icon>settings</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Asignar Ip</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>        
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar id="tool" dark app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">BK03 </span>

      </v-toolbar-title>
      <span class="hidden-sm-and-down" v-if="$store.state.usuario">Usuario: {{usuario()}}</span>
      <v-spacer></v-spacer>
      <span class="hidden-sm-and-down" v-if="$store.state.usuario">Farmacia: {{farmacia()}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="salir()" v-if="logueado">
        <v-icon>logout</v-icon>
      </v-btn>
      <v-btn icon :to="{name:login}" v-else>
        <v-icon>apps</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>

          <v-card flat tile id="tool" class="white--text">
            <v-card-text class="white--text pt-0">Linea de farmacias Tu Ahorro, Salud para tu bolsillo. &copy;2020</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>

import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      drawer: true,
      login:"",
      user:"",
      farma:"",



    };

  },
  computed: {

    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ee381b0005ebf28f0e52609"
      );
    },
    esJefe() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ee7b4c26865ec48c8f6bc0b"
      );
    },
    esSupervisor() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ee381dd005ebf28f0e5260c"
      );
    },
    esLider() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ee381d3005ebf28f0e5260a"
      );
    },
    esVendedor() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ee381d7005ebf28f0e5260b"
      );
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
  },

  methods: {
    farmacia(){
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia
      let configuracion = { headers: header };
      if (codigoFarmacia!=undefined){
        axios
            .get("farmacia/query?_id="+codigoFarmacia, configuracion)
            .then(function(response) {
              me.farma=response.data.descripcion
            })
            .catch(function(error) {
              console.log(error);
            });


      }else{
        me.farma="ADMINISTRADOR"
      }
      return this.farma
    },
    usuario(){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
          .get("usuario/query?_id="+this.$store.state.usuario.codigoUsuario, configuracion)
          .then(function(response) {
            me.user=response.data.nombres
          })
          .catch(function(error) {
            console.log(error);
          });

      return this.user
    },
    isMobile(){
      if( (navigator.userAgent.match(/Android/i)) ||
            (navigator.userAgent.match(/webOS/i)) ||
            (navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i)) ||
            (navigator.userAgent.match(/BlackBerry/i))){

              return true
      }else{

        return false
      }

    },
    salir() {
      this.$store.dispatch("salir");
      this.Farmacia='';
      this.NombreUsuario='';
      this.usuarios=[];
      this.farmacias=[];
    },
  }

};
</script>
<style>
#tool{
 background-color: #5e8ace;
 /* background-image: url("./assets/19399009.jpg"); */
 /* background-repeat: no-repeat;
    background-size: cover; */
}
</style>
