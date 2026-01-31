import { cn } from "@/lib/utils";

export interface BotaoPrimario {
    classe?: string;
    desabilitado?: boolean;
    tamanho?: "sm" | "md" | "lg";
    variante?: "primario" | "secundario" | "perigo";
    children: React.ReactNode;
    onClick?: () => void;
}

export function Botao({
    classe,
    desabilitado = false,
    tamanho = "md",
    variante = "primario",
    children,
    onClick,
}: BotaoPrimario) {
    const tamanhos = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const variantes = {
        primario: "bg-purple-600 hover:bg-purple-700 text-white",
        secundario: "bg-gray-700 hover:bg-gray-800 text-white",
        perigo: "bg-red-600 hover:bg-red-700 text-white",
    };

    return (
        <button
            onClick={onClick}
            disabled={desabilitado}
            className={cn(
                "rounded-lg font-semibold transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                tamanhos[tamanho],
                variantes[variante],
                classe
            )}
        >
            {children}
        </button>
    );
}

export const Button = Botao;

