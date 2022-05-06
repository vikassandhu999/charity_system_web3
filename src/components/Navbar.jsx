import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  Text
} from '@chakra-ui/react';
import { Link as RRLink } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useWeb3 } from "../Web3Provider";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isCharityManager } = useWeb3();
  return (
    <Box
      maxW={'1800px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'xl'}
      rounded={'md'}
      px={6}
      m={0}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Text>
              Authenticity
            </Text>
          </Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>

            <Link
              px={2}
              py={1}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
              }}
              to={'/charities'}
              as={RRLink}
            >
              Charities
            </Link>

            <Link
              px={2}
              py={1}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
              }}
              to={'/create-charity'}
              as={RRLink}
            >
              Create charity
            </Link>

          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          {isCharityManager ? "Manager" : "Donor"}
        </Flex>
      </Flex>
    </Box>
  );
}