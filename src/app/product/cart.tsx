import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { Header } from "../../components/header";
import { ProductCartProps, useCartStore } from "../../stores/cart-store";
import { Product } from "../../components/product";
import { formatCurrency } from "../../utils/functions/format-currency";
import { Input } from "../../components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "../../components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "../../components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5527999615828"

export default function Cart() {
    const cartStore = useCartStore()
    const [address, setAddress] = useState("")
    const navigation = useNavigation()

    const total = formatCurrency(cartStore.products.reduce((total, product) =>
        total + product.price * product.quantity, 0))


    function handleProductRemove(product: ProductCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [{
            text: "Cancelar",
        },
        {
            text: "Remover",
            onPress: () => cartStore.remove(product.id),
        },
        ])
    }

    function handleOrder() {
        if (address.trim().length === 0) {
            return Alert.alert("Pedido", "Informe os dados da entrega!")
        }

        const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`
        ).join("")

        const message =
        `🍔 NOVO PEDIDO 🍔
        \nEntregar em: ${address}

        ${products}

        \nValor total: ${total}`

        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear()
        navigation.goBack()

    }

    return <View className="flex-1 pt-8">
        <Header title="Seu Carrinho" />
        <KeyboardAwareScrollView>
            <ScrollView >
                <View className="p-5 flex-1">
                    {cartStore.products.length > 0 ? (
                        <View>
                            {cartStore.products.map((product) => (
                                <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                            ))}
                        </View>
                    ) : (
                        <Text className="font-body text-slate-400 text-center my-8 ">
                            Seu carrinho está vazio
                        </Text>
                    )}
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
        <View className="flex-row gap-2 items-center pt-3 pb-4 px-4 bg-slate-800">
            <Text className="text-white text-2xl font-subtitle">
                Total:
            </Text>
            <Text className="text-lime-400 text-2xl font-heading">
                {total}
            </Text>
        </View>
        <Input placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento"
            onChangeText={setAddress} />
        <View>
            <Button onPress={handleOrder}>
                <Button.Text>Enviar Pedido</Button.Text>
                <Button.Icon><Feather name="arrow-right-circle" size={20}></Feather></Button.Icon>
            </Button>
            <LinkButton title="Voltar ao cardápio" href="/" className="py-3 " />
        </View>
    </View>
}