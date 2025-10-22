// src/components/ui/Input.tsx

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  icon?: LucideIcon;
  required?: boolean;
  minLength?: number;
}

export default function Input({
  type,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  required = false,
  minLength,
}: InputProps) {
  return (
    <div className="w-full space-y-1">
      {/* Aseguramos que la etiqueta sea visible y tenga buen contraste */}
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {/* El Ícono */}
        {Icon && (
          <Icon
            // Corregimos la posición del ícono para que no se vea el borde
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={20}
          />
        )}
        
        {/* El Campo de Input con estilos corregidos */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`
                w-full 
                py-3 
                
                // MEJORAS DE DISEÑO:
                border-none                      // Eliminamos el borde de 1px por defecto
                rounded-xl                       // Bordes más suaves (coherente con el formulario)
                bg-slate-100                     // Fondo gris claro sutil (Moderno y no negro)
                text-slate-800                   // Texto oscuro legible

                // FOCO Y TRANSICIONES:
                focus:bg-white                   // Fondo blanco al hacer focus
                focus:ring-2 focus:ring-blue-500 // Anillo de foco
                focus:border-blue-500            // Borde de foco
                transition duration-200 ease-in-out

                // PADDING DINÁMICO:
                ${Icon ? 'pl-10 pr-4' : 'pl-4 pr-4'}
            `}
        />
      </div>
    </div>
  );
}