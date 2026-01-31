"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface DadosAutenticacao {
    nomeUsuario: string;
    senha: string;
}

interface EstadoAutenticacao {
    estaAutenticado: boolean;
    nomeRevendedor: string | null;
    esMestre: boolean;
    carregando: boolean;
    erro: string | null;
}

export function useAutenticacao() {
    const [estado, setEstado] = useState<EstadoAutenticacao>({
        estaAutenticado: false,
        nomeRevendedor: null,
        esMestre: false,
        carregando: true,
        erro: null,
    });

    const roteador = useRouter();

    // Verificar autenticação ao carregar
    const verificarAutenticacao = useCallback(() => {
        const nomeRevendedor = sessionStorage.getItem("reseller");
        const esMestre = sessionStorage.getItem("isMaster") === "true";

        if (nomeRevendedor) {
            setEstado({
                estaAutenticado: true,
                nomeRevendedor,
                esMestre,
                carregando: false,
                erro: null,
            });
        } else {
            setEstado((prev) => ({ ...prev, carregando: false }));
        }
    }, []);

    // Fazer login
    const fazerLogin = useCallback(
        async (dados: DadosAutenticacao) => {
            setEstado((prev) => ({ ...prev, carregando: true, erro: null }));

            try {
                const { data, error } = await supabase
                    .from("resellers")
                    .select("*")
                    .eq("name", dados.nomeUsuario)
                    .eq("password", dados.senha)
                    .single();

                if (error || !data) {
                    throw new Error("Usuário ou senha inválidos");
                }

                sessionStorage.setItem("reseller", data.name);
                sessionStorage.setItem("isMaster", data.is_master ? "true" : "false");

                setEstado({
                    estaAutenticado: true,
                    nomeRevendedor: data.name,
                    esMestre: data.is_master || false,
                    carregando: false,
                    erro: null,
                });

                roteador.push("/painel");
            } catch (erro) {
                const mensagem =
                    erro instanceof Error ? erro.message : "Erro ao conectar";
                setEstado((prev) => ({
                    ...prev,
                    carregando: false,
                    erro: mensagem,
                }));
            }
        },
        [roteador]
    );

    // Fazer logout
    const fazerLogout = useCallback(() => {
        sessionStorage.clear();
        setEstado({
            estaAutenticado: false,
            nomeRevendedor: null,
            esMestre: false,
            carregando: false,
            erro: null,
        });
        roteador.push("/");
    }, [roteador]);

    return {
        ...estado,
        fazerLogin,
        fazerLogout,
        verificarAutenticacao,
    };
}
