import { RACAS } from '../data/racas'
import { VACINAS } from '../data/vacinas'
import { calcularIdadeMeses } from './ageUtils'

export const FORM_ANIMAL_INICIAL = {
  tipo: 'bovino',
  identificacao: '',
  raca: '',
  outraRaca: '',
  produtividadeLeite: '',
  peso: '',
  sexo: '',
  dataNasc: '',
  status: 'saudavel',
  vacina: '',
  outraVacina: '',
  historico: '',
}

function mapearOpcao(valor, opcoes) {
  if (!valor) return { valor: '', outro: '' }
  if (opcoes.includes(valor)) {
    return { valor: valor === 'Outra' ? '__outra__' : valor, outro: '' }
  }
  return { valor: '__outra__', outro: valor }
}

export function animalParaForm(animal) {
  if (!animal) return { ...FORM_ANIMAL_INICIAL }

  const tipo = animal.tipo || 'bovino'
  const racas = RACAS[tipo] || []
  const { valor: raca, outro: outraRaca } = mapearOpcao(animal.raca, racas)

  const vacinasList = VACINAS[tipo] || []
  const primeiraVacina = animal.vacinas?.[0] || ''
  const { valor: vacina, outro: outraVacina } = mapearOpcao(primeiraVacina, vacinasList)

  return {
    tipo,
    identificacao: animal.identificacao || '',
    raca,
    outraRaca,
    produtividadeLeite: animal.produtividadeLeite || '',
    peso: animal.peso ?? '',
    sexo: animal.sexo || '',
    dataNasc: animal.dataNasc || '',
    status: animal.status || 'saudavel',
    vacina,
    outraVacina,
    historico: animal.historico || '',
  }
}

export function formParaAnimal(form) {
  const racaFinal =
    form.raca === '__outra__'
      ? form.outraRaca.trim() || 'Outra'
      : form.raca

  const vacinaFinal =
    form.vacina === '__outra__'
      ? form.outraVacina.trim() || 'Outra'
      : form.vacina

  const idadeCalculada = calcularIdadeMeses(form.dataNasc)

  const animal = {
    tipo: form.tipo,
    identificacao: form.identificacao.trim(),
    raca: racaFinal,
    idade: idadeCalculada != null ? String(idadeCalculada) : null,
    peso: form.peso || null,
    sexo: form.sexo || null,
    dataNasc: form.dataNasc || null,
    status: form.status,
    vacinas: vacinaFinal ? [vacinaFinal] : [],
    historico: form.historico.trim(),
  }

  if (form.tipo === 'bovino' && form.sexo === 'femea' && form.produtividadeLeite.trim()) {
    animal.produtividadeLeite = form.produtividadeLeite.trim()
  } else {
    animal.produtividadeLeite = null
  }

  return animal
}

export function validarFormAnimal(form) {
  const erros = {}
  if (!form.identificacao.trim()) {
    erros.identificacao = 'Identificação é obrigatória.'
  }
  if (!form.raca) {
    erros.raca = 'Selecione uma raça.'
  }
  return erros
}
