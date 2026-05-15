import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { api } from "../api/api";
import apiService from "../api/apiService.ts";
import {register} from "../api/endpoints.ts";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthDate: "",
    jobPosition: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!acceptTerms) {
      setError("Debes aceptar los términos de uso para crear una cuenta.");
      setLoading(false);
      return;
    }

    try {
      await apiService.create(register, form);
      //await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar. Verifica tu información.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Somnolencia</h1>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Únete al Sistema<br />de Monitoreo
          </h2>
          <p className="text-blue-100 text-lg">
            Completa tu registro para comenzar a monitorear tu estado de alerta mientras conduces.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Datos seguros y privados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Monitoreo en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Alertas instantáneas</span>
            </div>
          </div>
        </div>
        <p className="text-blue-200 text-sm">©{new Date().getFullYear()} Sistema de Detección de Somnolencia</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Somnolencia</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
              <p className="text-gray-500 mt-1">Ingresa tus datos para registrarte</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Nombre del Usuario"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Correo Principal"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    name="birthDate"
                    type="date"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={form.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puesto de Trabajo</label>
                  <input
                    name="jobPosition"
                    type="text"
                    placeholder="Cargo"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={form.jobPosition}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    He leído y acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Términos de Uso
                    </button>
                    {" "}y{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Política de Privacidad
                    </button>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !acceptTerms}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTerms(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Términos de Uso</h2>
              <button onClick={() => setShowTerms(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-600">
              <p><strong>1. Aceptación de Términos</strong><br />Al crear una cuenta, aceptas estos términos de uso y políticas de privacidad.</p>
              <p><strong>2. Uso del Sistema</strong><br />El sistema está diseñado para monitorear el estado de somnolencia de choferes durante su actividad laboral. El uso correcto es responsabilidad del usuario.</p>
              <p><strong>3. Privacidad de Datos</strong><br />Los datos recopilados (nombre, correo, fecha de nacimiento, puesto de trabajo) serán utilizados únicamente para el monitoreo y gestión de la cuenta.</p>
              <p><strong>4. Monitoreo en Tiempo Real</strong><br />El sistema detectará eventos de somnolencia y emitirá alertas para garantizar la seguridad del conductor.</p>
              <p><strong>5. Responsabilidad</strong><br />El usuario es responsable de mantener sus credenciales seguras y de usar el sistema de manera responsable.</p>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button onClick={() => setShowTerms(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}