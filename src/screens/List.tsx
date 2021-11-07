import React, {useEffect, useState} from 'react'
import {
    Input,
    Button,
    Checkbox,
    Text,
    VStack,
    HStack,
    Heading,
    Center,
    Box,
} from 'native-base';
import {ListType} from "./Main";
import {db} from "../App";
import {toNumber} from "lodash";


const List = ({route: { params }}: {route: {params: ListType}}) => {
    const [products, setProducts] = useState<ListType[] | undefined>()
    const [inputValue, setInputValue] = useState<string>('');
    const [amountOfProducts, setAmountOfProducts] = useState<number | null>(null);
    const [productPrice, setProductPrice] = useState<number | null>(null);
    const [error, setError] = useState<string | undefined>();

    const getProducts = () => {
        db.transaction((tx => {
            tx.executeSql(`SELECT * FROM lists WHERE listName LIKE '${params.listName}'`, [], (tx, resultSet) => {
                const len = resultSet.rows.length
                const result = []

                if(!len){
                    return
                }

                for(let i=0; i<len; i++){
                    result.push(resultSet.rows.item(i))
                }

                setProducts(result)
            })
        }))
    }

    const handlePriceChange = (text: string) => {
        if (/^\d+$/.test(text)) {
            setProductPrice(toNumber(text));
        }
    }

    const handleAmountChange = (text: string) => {
        if (/^\d+$/.test(text)) {
            setAmountOfProducts(toNumber(text));
        }
    }

    const addProducts = async (product: string, amount: number | null, price: number | null) => {
        await db.transaction((tx => {
            tx.executeSql('INSERT INTO lists '
                +'(listName, product, price, amount, isBought) '
                +`VALUES("${params.listName}", "${product}", ${price}, ${amount}, false);`)
        }), (error) => console.log('error', error), (success) => console.log('success', success))
    };

    const setProductIsBought = async (id: string | number, isBought: boolean) => {
        await db.transaction((tx => {
            tx.executeSql('UPDATE lists '
                +`SET isBought=${isBought} `
                +`WHERE id=${id};`)
        }), (error) => console.log('error', error), () => console.log('success'))
    }

    const removeProduct = async (id: string | number) => {
        await db.transaction((tx => {
            tx.executeSql('DELETE FROM lists '
                +`WHERE id=${id};`)
        }), (error) => console.log('error', error), () => console.log('success'))
    }

    useEffect(() => {
        getProducts()
    })

    useEffect(() => {
        return () => {
            setProducts(undefined)
            setInputValue('');
            setAmountOfProducts(null);
            setProductPrice(null);
            setError(undefined);
        }
    }, [])

    if(!products){
        return <Text>Loading...</Text>
    }


    return(
            <Box flex={1} justifyContent="flex-start" p={10}>
                <Heading mb="5">{params.listName}</Heading>
                <VStack space={4}>
                    <HStack space={2} direction="column">
                        <Input
                            onChangeText={(v) => setInputValue(v)}
                            value={inputValue}
                            placeholder="Product"
                            isRequired={true}
                        />
                            <Input
                                onChangeText={handleAmountChange}
                                value={amountOfProducts?.toString()}
                                keyboardType="numeric"
                                placeholder="Amount"
                                isRequired={true}
                            />
                        <Input
                            onChangeText={handlePriceChange}
                            value={productPrice?.toString()}
                            keyboardType="numeric"
                            placeholder="Price"
                        />

                        <Button
                            borderRadius="sm"
                            variant="solid"
                            onPress={async () => {
                                if(!inputValue){
                                    setError('Pass Product!')
                                }
                                await addProducts(inputValue, amountOfProducts, productPrice)
                                setInputValue('');
                                setAmountOfProducts(null);
                                setProductPrice(null);
                            }}
                        >
                            Add product
                        </Button>
                        {error && <Center><Text color="red.400">{error}</Text></Center>}
                    </HStack>
                    <VStack space={2}>
                        {products?.filter((item) => item.product !== null)?.map((item: ListType, index: number) => (
                            <HStack
                                w="100%"
                                justifyContent="space-between"
                                alignItems="center"
                                key={item.listName + index.toString()}>
                                <Checkbox
                                    isChecked={item.isBought}
                                    onChange={(isBought) => setProductIsBought(item.id, isBought)}
                                    value={item?.product || ''}>
                                    <Box width="90%" flexDirection="row" justifyContent="space-between" alignItems="center">
                                    <Text
                                        mx="2"
                                        strikeThrough={item.isBought}
                                        >
                                        {item?.product}
                                    </Text>
                                        <Box flexDirection="column">
                                            <Text strikeThrough={item.isBought}>Amount: {item?.amount}</Text>
                                            <Text strikeThrough={item.isBought}>Total Price: {(toNumber(item?.amount) * toNumber(item?.price))}</Text>
                                        </Box>
                                    </Box>
                                </Checkbox>
                                <Button
                                    size="sm"
                                    colorScheme="trueGray"
                                    onPress={() => removeProduct(item.id)}
                                >
                                    -
                                </Button>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            </Box>
    )
}

export default List
