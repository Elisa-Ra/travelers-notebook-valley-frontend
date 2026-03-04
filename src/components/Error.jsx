import { Alert } from "react-bootstrap"

const Error = () => (
  <Alert variant="danger">
    <Alert.Heading>
      Ops, qualcosa è andato storto! Riprova più tardi!
    </Alert.Heading>
  </Alert>
)

export default Error
