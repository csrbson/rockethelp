import { useState } from 'react';
import { VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Alert } from 'react-native';

export function Register() {
  const [patrimony, setPatrimony] = useState('')
  const [description, setDescription] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Registrar', 'Preencha todos os campos')
    }

    setIsLoading(true)

    firestore().collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação registrada com sucesso.')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false)
        return Alert.alert('Solicitação', 'Não foi possível registrar a solicitação')
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação" />
      <Input onChangeText={setPatrimony} placeholder='número do patrimônio' mt={4} />
      <Input onChangeText={setDescription} placeholder='descrição do problema' flex={1} mt={5} multiline textAlignVertical='top' />
      <Button isLoading={isLoading} onPress={handleNewOrderRegister} title="Cadastrar" mt={5} />
    </VStack>
  );

}