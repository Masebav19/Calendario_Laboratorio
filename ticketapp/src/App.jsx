import { useState } from 'react'
import './App.css'
import Apertura from './components/Apertura'
import Cierre from './components/Cierre'
import Consulta from './components/Consulta'

function App() {
  const [menu, SetMenu] = useState(undefined)
  return (
    <>
      <header>
        <h2>
          Laboratorio de Instrumentación Industrial
        </h2>
        <nav>
          <span className={`navOption ${menu === "Apertura"?"Activate":""}`} onClick={()=>SetMenu("Apertura")}>
            Apertura
          </span>
          <span className={`navOption ${menu === "Cierre"?"Activate":""}`} onClick={()=>SetMenu("Cierre")}>
            Cierre
          </span>
          <span className={`navOption ${menu === "Consulta"?"Activate":""}`} onClick={()=>SetMenu("Consulta")}>
            Consulta
          </span>
        </nav>
      </header>
      <main>
        {menu === "Apertura" &&
        <Apertura/>
        }
        {
          menu === "Cierre" &&
          <Cierre/>
        }
        {
          menu === "Consulta" &&
          <Consulta/>
        }
      </main>
      <footer>
        <small>Laboratorio de redes Industriales</small>
        <small><strong>Coordinadora: </strong>Silvana del Pilar Gamboa</small>
        <small><strong>Contacto: </strong><a href="mailto://silvana.gamboa@epn.edu.ec">silvana.gamboa@epn.edu.ec</a></small>
      </footer>
    </>
  )
}

export default App
