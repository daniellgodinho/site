// Tipos relacionados à autenticação
export interface Revendedor {
    id: string;
    nome: string;
    email?: string;
    esMestre: boolean;
    criadoEm: string;
    atualizadoEm: string;
}

// Tipos relacionados a usuários
export interface Usuario {
    nomeUsuario: string;
    duracao: "vitalicio" | "mensal" | "anual";
    expiracao?: string;
    criadoEm: string;
}

export interface ListaUsuarios {
    id: string;
    revendedor: string;
    usuarios: Usuario[];
    usuariosFarm: Usuario[];
    criadoEm: string;
    atualizadoEm: string;
}

// Tipos relacionados a links de resgate
export interface LinkResgate {
    id: string;
    chave: string;
    duracao: "vitalicio" | "mensal" | "anual";
    maxUsos: number;
    usosRestantes: number;
    ativo: boolean;
    criadoEm: string;
    expiracao?: string;
}

// Tipos de resposta
export interface RespostaPaginacao<T> {
    dados: T[];
    pagina: number;
    totalPaginas: number;
    totalItens: number;
}

export interface RespostaErro {
    codigo: string;
    mensagem: string;
    detalhes?: unknown;
}

// Tipos de configuração
export interface ConfiguracaoApp {
    nomeLoja: string;
    logoUrl?: string;
    temaPrimario: string;
    suporteMail?: string;
    discordLink?: string;
}
