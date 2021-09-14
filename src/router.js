import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Categoria from './components/Categoria.vue'
import Presentacion from './components/Presentacion.vue'
import Laboratorio from './components/Laboratorio.vue'
import Rol from './components/Rol.vue'
import TipoDocumentos from './components/Tipodocumento.vue'
import Farmacias from './components/Farmacias.vue'
import Farmacia from './components/Farmacia.vue'
import Usuario from './components/Usuario.vue'
import Cliente from './components/Cliente.vue'
import Proveedor from './components/Proveedor.vue'
import TipoComprobantes from './components/Tipocomprobante.vue'
import Inventarios from './components/Inventario.vue'
import Articulo from './components/Articulos.vue'
import Login from './components/Login.vue'
import Ingreso from './components/Ingreso.vue'
import store from './store'
import Acceso from './components/Accesos.vue'
import Ventas from './components/Venta.vue'
import Cta from './components/ctacobrar.vue'
import consultas from './components/ConsultaVentas.vue'
import arqueos from './components/Arqueos.vue'
import egresso from './components/Egresos.vue'
import Cupo from './components/Cupo.vue'
import Promocion from './components/Promocion.vue'
import ConsultasxLab from './components/ConsultasxLaboratorio.vue'
import Vademecum from './components/vademecum.vue'
import Propietarios from './components/Propietarios.vue'
import ConsultasIngresos from './components/ConsultaIngresos.vue'
import descuentos from './components/Descuentos.vue'
import transferencias from './components/Transferencias.vue'
import consultadetalles from './components/ConsultaDetalles'
import facturasd from './components/Facturas_dup'
import estadisticas from './components/Estadisticas'
import consultadetallesCompras from './components/ConsultaDetallesCompra'
import reportes from './components/Reportes'
import Cotizacion from './components/Cotizacion'
import seguimiento from './components/seguimiento'
import cuc from './components/cambiarusuarioclave'
import asignarIp from './components/asignarip.vue'
import actualizarinf from './components/ActualizarInfo.vue'
import consultadetallesA from './components/ConsultaDetallesReporte.vue'
import rentabilidad from './components/rentabilidad.vue'
Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    ,
    {
      path: '/rentabilidad',
      name: 'rentabilidad',
      component: rentabilidad,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/actualizarinf',
      name: 'actualizarinf',
      component: actualizarinf,
      meta:{
        administrador:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/asignarip',
      name: 'asignarip',
      component: asignarIp,
      meta:{
        administrador:true,
        
        supervisor:true,
        jefe:true
      }
    }
    ,
    {
      path: '/consultadetallesA',
      name: 'consultadetallesA',
      component: consultadetallesA,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/seguimiento',
      name: 'seguimiento',
      component: seguimiento,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/cuc',
      name: 'cuc',
      component: cuc,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/cotizacion',
      name: 'cotizacion',
      component: Cotizacion,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
     path: '/consultadetallesCompras',
     name: 'consultadetallesCompras',
     component: consultadetallesCompras,
     meta:{
       administrador:true,
       vendedor:true,
       lider:true,
       supervisor:true,
       jefe:true
     }
   },
     {
      path: '/consultadetalles',
      name: 'consultadetalles',
      component: consultadetalles,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: reportes,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/estadisticas',
      name: 'estadisticas',
      component: estadisticas,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/descuentos',
      name: 'descuentos',
      component: descuentos,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/transferencias',
      name: 'transferencias',
      component: transferencias,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/facturasd',
      name: 'facturasd',
      component: facturasd,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/consultaingresos',
      name: 'consultaingresos',
      component: ConsultasIngresos,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/arqueos',
      name: 'arqueos',
      component: arqueos,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/categoria',
      name: 'categoria',
      component: Categoria,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/egresos',
      name: 'egresos',
      component: egresso,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/presentacion',
      name: 'presentacion',
      component: Presentacion,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/laboratorio',
      name: 'laboratorio',
      component: Laboratorio,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/rol',
      name: 'rol',
      component: Rol,
      meta:{
        administrador:true,

      }
    },
    {
      path: '/tipodocumento',
      name: 'tipodocumento',
      component: TipoDocumentos,
      meta:{
        administrador:true,

      }
    },
    {
      path: '/tipocomprobante',
      name: 'tipocomprobante',
      component: TipoComprobantes,
      meta:{
        administrador:true,

      }
    },
    {
      path: '/farmacias',
      name: 'farmacias',
      component: Farmacias,
      meta:{
        administrador:true,

        supervisor:false,
        jefe:false
      }
    },
    {
      path: '/farmacia',
      name: 'farmacia',
      component: Farmacia,
      meta:{
        administrador:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/articulo',
      name: 'articulo',
      component: Articulo,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta:{
        administrador:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/acceso',
      name: 'acceso',
      component: Acceso,
      meta:{
        administrador:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: Cliente,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: Inventarios,
      meta:{
        administrador:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: Proveedor,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: Ingreso,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/venta',
      name: 'venta',
      component: Ventas,
      meta:{
        administrador:true,
        vendedor:true,
        lider:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/consultasVentas',
      name: 'ConsultasVentas',
      component: consultas,
      meta:{
        administrador:true,
        lider:true,
        vendedor:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/cta',
      name: 'ctaCobrar',
      component: Cta,
      meta:{
        administrador:true,
        lider:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/cupo',
      name: 'cupo',
      component: Cupo,
      meta:{
        administrador:true,
        lider:true,

        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/promocion',
      name: 'promocion',
      component: Promocion,
      meta:{
        administrador:true,
        lider:true,
        vendedor:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/consultaLab',
      name: 'consultaLab',
      component: ConsultasxLab,
      meta:{
        administrador:true,
        lider:true,
        vendedor:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/vademecum',
      name: 'vademecum',
      component: Vademecum,
      meta:{
        administrador:true,
        lider:true,
        vendedor:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/propietarios',
      name: 'propietarios',
      component: Propietarios,
      meta:{
        administrador:true,
        supervisor:true,
        jefe:true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        libre:true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  }else if (store.state.usuario && store.state.usuario.rol=='5ee381b0005ebf28f0e52609') {
    if (to.matched.some(record => record.meta.administrador)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='5ee7b4c26865ec48c8f6bc0b') {
    if (to.matched.some(record => record.meta.jefe)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='5ee381d3005ebf28f0e5260a') {
    if (to.matched.some(record => record.meta.vendedor)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='5ee381dd005ebf28f0e5260c') {
    if (to.matched.some(record => record.meta.supervisor)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='5ee381d7005ebf28f0e5260b') {
    if (to.matched.some(record => record.meta.lider)) {
      next()
    }
  }
  else{
    next({name:'login'})
  }
})

export default router
