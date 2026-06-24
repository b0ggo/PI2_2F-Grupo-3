import { validarNomeCompleto, getMensagemErroNome } from '../utils/nameValidation.js';
import { validarFormatoEmail, getMensagemErroEmail, normalizarEmail } from '../utils/emailValidation.js';
import { validarTelefoneBrasileiro, getMensagemErroTelefone, extrairDigitosTelefone } from '../utils/phoneValidation.js';
import { validarCPF, getMensagemErroCPF, extrairDigitosCPF, temComprimentoCPFCorreto } from '../utils/cpfValidation.js';
import { validarCNPJ, getMensagemErroCNPJ, extrairDigitosCNPJ, temComprimentoCNPJCorreto } from '../utils/cnpjValidation.js';
import { validarForcaSenha, getMensagemErroSenha, temLetra, temNumero, temCaractereEspecial, obterDetalhesValidacaoSenha } from '../utils/passwordValidation.js';
import { validarNomeMunicipio, getMensagemErroMunicipio, normalizarNomeMunicipio } from '../utils/municipalityValidation.js';
import { obterEstadosPorCodigo, obterEstadoPorSigla, ehSiglaEstadoValida } from '../utils/brazilianStates.js';
import { formatarTelefone, formatarCPF, formatarCNPJ, formatarCPFOuCNPJ } from '../utils/formatters.js';

export { validarNomeCompleto, getMensagemErroNome };
export { validarFormatoEmail, getMensagemErroEmail, normalizarEmail };
export { validarTelefoneBrasileiro, getMensagemErroTelefone, extrairDigitosTelefone };
export { validarCPF, getMensagemErroCPF, extrairDigitosCPF, temComprimentoCPFCorreto };
export { validarCNPJ, getMensagemErroCNPJ, extrairDigitosCNPJ, temComprimentoCNPJCorreto };
export { validarForcaSenha, getMensagemErroSenha, temLetra, temNumero, temCaractereEspecial, obterDetalhesValidacaoSenha };
export { validarNomeMunicipio, getMensagemErroMunicipio, normalizarNomeMunicipio };
export { obterEstadosPorCodigo, obterEstadoPorSigla, ehSiglaEstadoValida };
export { formatarTelefone, formatarCPF, formatarCNPJ, formatarCPFOuCNPJ };

export const validarNome = validarNomeCompleto;
export const validarEmail = validarFormatoEmail;
export const validarTelefone = validarTelefoneBrasileiro;
export const validarCpf = validarCPF;
export const validarCnpj = validarCNPJ;
export const validarSenha = validarForcaSenha;
export const validarMunicipio = validarNomeMunicipio;
export const validarEstado = ehSiglaEstadoValida;
export const obterEstados = obterEstadosPorCodigo;
