import { useAuth } from '../hooks/useAuth'

const DashboardPage = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl text-center mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Bienvenido, {user?.email}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explora las funcionalidades de tu aplicación.
        </p>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Content Blocks Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {/* Block 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Información 1</h2>
          <p className="text-gray-500 text-center">Aquí puedes añadir contenido relevante.</p>
        </div>

        {/* Block 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Datos</h2>
          <p className="text-gray-500 text-center">Visualiza métricas o estadísticas importantes.</p>
        </div>

        {/* Block 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Acciones</h2>
          <p className="text-gray-500 text-center">Botones o enlaces a funcionalidades clave.</p>
        </div>

        {/* Block 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Notificaciones</h2>
          <p className="text-gray-500 text-center">Muestra alertas o mensajes importantes.</p>
        </div>

        {/* Block 5 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Configuración</h2>
          <p className="text-gray-500 text-center">Acceso rápido a ajustes de usuario.</p>
        </div>

        {/* Block 6 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bloque de Ayuda</h2>
          <p className="text-gray-500 text-center">Enlaces a documentación o soporte.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
