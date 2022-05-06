import React, { } from "react";
import {
    Heading,
    Box,
    Center,
    Text,
    Stack,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function CharityCard({ name, contractAddress, minimumContribution, approversCount }) {
    return (
        <Box
            maxW={'400px'}
            width='100%'
            minH={'280px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}>
            <Box p={6}>
                <Stack spacing={0} align={'left'} mb={5}>
                    <Heading minH={20} fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        {name}
                    </Heading>
                    <Box p={2} />
                    <Text color={'gray.500'}>Total donors : {approversCount}</Text>
                    <Box p={1} />
                    <Text color={'gray.500'}>Minimum donation ammount : {minimumContribution}</Text>
                </Stack>

                <Link to={`/charities/${contractAddress}`}>
                    <Button
                        w={'full'}
                        mt={2}
                        bg={useColorModeValue('#151f21', 'gray.900')}
                        color={'white'}
                        rounded={'md'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}>
                        See details
                    </Button>
                </Link>

            </Box>
        </Box>
    );
}