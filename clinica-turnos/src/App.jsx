import { useClinicaSistema } from './hooks/useClinicaSistema';
import PacientesEspera from './components/PacientesEspera';
import HistorialAtencion from './components/HistorialAtencion';
import MedicoGuardia from './components/MedicoGuardia';
import ComiteAdministrativo from './components/ComiteAdministrativo';
import './App.css';

function App() {
  const {
    pacientes,
    historial,
    medicos,
    medicoActual,
    comite,
    miembroActual,
    segundosParaRotar,
    agregarPaciente,
    atenderPaciente,
    atenderSiguiente,
    rotarMedicoManual,
    avanzarComite,
    retrocederComite,
  } = useClinicaSistema();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Turnos - Clínica</h1>
        <p>Estructuras de datos enlazadas aplicadas con React</p>
      </header>

      <main className="grid">
        <PacientesEspera
          pacientes={pacientes}
          onAgregar={agregarPaciente}
          onAtender={atenderPaciente}
          onAtenderSiguiente={atenderSiguiente}
        />

        <HistorialAtencion historial={historial} />

        <MedicoGuardia
          medicos={medicos}
          medicoActual={medicoActual}
          segundosParaRotar={segundosParaRotar}
          onRotarManual={rotarMedicoManual}
        />

        <ComiteAdministrativo
          comite={comite}
          miembroActual={miembroActual}
          onAvanzar={avanzarComite}
          onRetroceder={retrocederComite}
        />
      </main>
    </div>
  );
}

export default App;
