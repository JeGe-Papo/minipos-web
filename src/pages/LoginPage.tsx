import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
    const { login } = useAuth();
    
    // Estado para saber si estamos en LOGIN o en REGISTRO
    const [isRegister, setIsRegister] = useState(false);

    // Estados del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");     // 👈 Nuevo para registro
    const [socialUrl, setSocialUrl] = useState("");   // 👈 Tu campo social_url

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Validación del lado del cliente 
    function validate(): string | null {
        if (isRegister && !fullName.trim()) return "El nombre completo es obligatorio.";
        if (!email.trim()) return "El usuario/email es obligatorio.";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        setError(null);
        
        try {
            if (isRegister) {
                // 🚀 LÓGICA DE REGISTRO (Envía social_url al backend de AWS)
                const res = await authApi.register({ 
                    fullName, 
                    email, 
                    password, 
                    social_url: socialUrl || undefined 
                });
                login(res.access_token, res.user.email);
                onSuccess();
            } else {
                // 🔑 LÓGICA DE LOGIN NORMAL
                const res = await authApi.login({ email, password });
                login(res.access_token, res.user.email);
                onSuccess(); 
            }
        } catch (err: any) {
            if (isRegister) {
                setError("El correo ya está registrado o los datos son inválidos.");
            } else {
                setError("Credenciales inválidas. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Limpia los errores al alternar entre pantallas
    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    {isRegister ? "Crear cuenta" : "Iniciar sesión"}
                </h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    
                    {/* CAMPO EXTRA: Solo se muestra si está en modo registro */}
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Ana Pérez"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Usuario (Email)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    {/* CAMPO EXTRA: Tu social_url, solo visible en registro */}
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Red Social (URL)</label>
                            <input
                                type="text"
                                value={socialUrl}
                                onChange={e => setSocialUrl(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: facebook.com/anag"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Procesando…" : isRegister ? "Registrarse" : "Ingresar"}
                    </button>
                </form>

                {/* BOTÓN PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
                <div className="mt-6 text-center text-sm text-slate-600">
                    {isRegister ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
                    <button 
                        onClick={toggleMode} 
                        className="text-blue-600 font-medium hover:underline focus:outline-none"
                    >
                        {isRegister ? "Inicia sesión" : "Regístrate aquí"}
                    </button>
                </div>

            </div>
        </div>
    );
}
