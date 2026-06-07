import Toast from '../Toast/Toast'

export default function MensagemAnimalSalvo({ visivel, variante = 'success' }) {
  const mensagens = {
    success: 'Animal cadastrado com sucesso!',
    offline: 'Salvo offline — sincronizará ao reconectar.',
    error: 'Erro ao salvar. Tente novamente.',
  }

  return (
    <Toast
      mensagem={mensagens[variante] ?? mensagens.success}
      tipo={variante}
      visivel={visivel}
    />
  )
}
