import { useState } from "react"
import { Heading, Icon, VStack, useTheme } from "native-base"
import { Envelope, Key } from "phosphor-react-native"

import Logo from "../assets/logo_primary.svg"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Alert } from "react-native"
import auth from "@react-native-firebase/auth"

export function SignIn() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'informe email e senha.')
    }

    setIsLoading(true)

    auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error)
        setIsLoading(false)

        if (error.code == 'auth/invalid-email') {
          return Alert.alert('Entrar', 'email inválido.')
        }

        if (error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
          return Alert.alert('Entrar', 'email ou senha inválido.')
        }
      })
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input onChangeText={setEmail} placeholder="E-mail" mb={4} InputLeftElement={<Icon ml={4} as={<Envelope color={colors.gray[300]} />} />} />
      <Input onChangeText={setPassword} placeholder="Senha" mb={8} secureTextEntry InputLeftElement={<Icon ml={4} as={<Key color={colors.gray[300]} />} />} />

      <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading} />
    </VStack>
  )
}