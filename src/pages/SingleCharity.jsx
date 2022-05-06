import {
    Box, TabList, Tab, TabPanels, TabPanel, Tabs, Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    AspectRatio,
    Stack,
    Image
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useWeb3 } from "../Web3Provider";
import CharityABI from '../contracts/Charity_abi.json';
import { useParams } from "react-router-dom";


const CreateRequest = ({ onRequestCreate }) => {
    const [description, setDescription] = useState("");
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);

    return (
        <Box p={4}>
            <form onSubmit={(e) => {
                e.preventDefault();
                onRequestCreate({ description, recipient, amount });
            }}>
                <FormControl>
                    <FormLabel htmlFor='email'>Description</FormLabel>
                    <Input id='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='email'>Amount</FormLabel>
                    <Input id='amount' type='number' value={amount} onChange={(e) => setAmount(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='email'>Recipient wallet address</FormLabel>
                    <Input id='recipient' type='text' value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </FormControl>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={false}
                    type='submit'
                >
                    Create request
                </Button>
            </form>
        </Box>
    );
}


const AllRequests = ({ contractAddress }) => {
    const { web3, account } = useWeb3();
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        (async () => {
            const singleCharityContract = new web3.eth.Contract(
                CharityABI,
                contractAddress,
            );
            const _requests = [];
            const numberOfRequests = await singleCharityContract.methods.numberOfRequests().call();
            for (let i = 0; i < numberOfRequests; i++) {
                _requests.push(await singleCharityContract.methods.requests(i).call());
            }
            console.log({ _requests });
            // const _requests = await singleCharityContract.methods.requests(0).call();

            setRequests(_requests);
        })();
    }, [web3, contractAddress, setRequests]);

    return (
        <div>
            <ul>
                {
                    requests.map((r, index) => (
                        <Box
                            p={4}
                            display={{ md: "flex" }}
                            maxWidth="32rem"
                            borderWidth={1}
                            margin={2}
                        >
                            <AspectRatio ratio={1 / 1}>
                                <Image
                                    maxWidth="200px"
                                    margin="auto"
                                    src="https://picsum.photos/id/237/250/250"
                                    alt="Woman paying for a purchase"
                                />
                            </AspectRatio>
                            <Stack
                                align={{ base: "center", md: "stretch" }}
                                textAlign={{ base: "center", md: "left" }}
                                mt={{ base: 4, md: 0 }}
                                ml={{ md: 6 }}
                            >
                                <Text
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    fontSize="lg"
                                    letterSpacing="wide"
                                    color="teal.600"
                                >
                                    {r.description}
                                </Text>
                                <Text my={2} color="gray.500">
                                    {r.completed}
                                </Text>
                                <Button maxWidth="100px" my={2}>
                                    Click me!
                                </Button>
                            </Stack>
                        </Box>
                    ))
                }
            </ul>
        </div>
    )

}

const LoadCharityComponents = ({ contractAddress }) => {
    const { web3, account } = useWeb3();
    const [name, setName] = useState("");
    useEffect(() => {
        (async () => {
            const singleCharityContract = new web3.eth.Contract(
                CharityABI,
                contractAddress,
            );
            const name = await singleCharityContract.methods.name().call();

            setName(name);
        })();
    }, [web3, contractAddress, setName]);


    const onRequestCreate = React.useCallback(async (values) => {
        const singleCharityContract = new web3.eth.Contract(
            CharityABI,
            contractAddress,
        );
        await singleCharityContract.methods.createRequest(
            values.description, values.amount, values.recipient
        ).send({
            from: account,
            gasPrice: '20000000000'
        });
    }, [web3, contractAddress, account]);

    return <Box mt={8} ml={'auto'} mr={'auto'}>
        <Text>{name}</Text>
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Requests</Tab>
                <Tab>Create request</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <AllRequests contractAddress={contractAddress} />
                </TabPanel>
                <TabPanel>
                    <CreateRequest onRequestCreate={onRequestCreate} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
}

const SingleCharity = () => {
    const { address } = useParams();
    return (
        <LoadCharityComponents contractAddress={address} />
    )
}

export default SingleCharity;