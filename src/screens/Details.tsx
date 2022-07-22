import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { HStack, Text, VStack, useTheme, ScrollView } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleWavyCheck, Clipboard, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';

import firestore from '@react-native-firebase/firestore'

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormats';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [solution, setSolution] = useState('')

  const { colors } = useTheme()
  const navigation = useNavigation()

  useEffect(() => {
    firestore().collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data()
        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        })

        setIsLoading(false)
      })
  }, [])


  const route = useRoute()
  const { orderId } = route.params as RouteParams

  if (isLoading) {
    return <Loading />
  }

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Informa a solução para encessar a solicitação')
    }

    firestore().collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({ status: 'closed', solution, closed_at: firestore.FieldValue.serverTimestamp() })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada')
        navigation.goBack()
      })
      .catch((error) => {
        Alert.alert('Solicitação', 'não foi possível encerrar a solicitação.')
      })
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Solicitação" />
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text fontSize="sm" ml={2} textTransform="uppercase" color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]} >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`patrimonio ${order.patrimony}`}
          icon={DesktopTower} />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`} />
        <CardDetails
          title="Solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}>
          {order.status === 'open' &&
            <Input onChangeText={setSolution} placeholder="descrição da solução" h={24} textAlignVertical="top" multiline />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' && <Button onPress={handleOrderClose} title="Encerrar solicitação" m={5} />
      }

    </VStack>
  );
}