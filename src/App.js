import React from "react";
import { useWeb3 } from "./Web3Provider";
import PageRouter from "./pages/PageRouter";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const App = () => {
  const {
    web3,
    account,
    charityContract,
    isLoadingWeb3,
    web3Error
  } = useWeb3();
  return (
    <Container style={{ maxWidth: "100vw", width: "100%", padding: 0, margin: 0 }}>
      {isLoadingWeb3 &&
        <Box marginLeft='auto' marginRight='auto'>
          <CircularProgress color="success" />
          <Typography>
            Loading Web3, accounts, and contract...
          </Typography>
        </Box>
      }
      {web3Error && <Box marginTop={20} direction='column' marginLeft='auto' marginRight='auto' spacing={4} justifyContent="center" alignItems={"center"}>
        <Typography fontSize='20px' color='tomato'>
          {web3Error}
        </Typography>
      </Box>}
      {web3 && account && charityContract && <PageRouter />}
    </Container>
  )
}

export default App;