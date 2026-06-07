import Toast from '../Toast/Toast'

export default function MensagemAnimalCancelado({ visivel }) {
  return (
    <Toast
      mensagem="Cadastro do animal cancelado."
      tipo="cancel"
      visivel={visivel}
    />
  )
}
