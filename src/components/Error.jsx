import { Alert } from "react-bootstrap"

const Error = () => (
  <Alert variant="danger" className="text-center w-50 mx-auto">
    <Alert.Heading>
      Ops, qualcosa è andato storto! Riprova più tardi!
    </Alert.Heading>
  </Alert>
)

export default Error
