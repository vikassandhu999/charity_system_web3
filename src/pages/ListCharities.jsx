import React, { useEffect, useState } from "react";
import { useWeb3 } from "../Web3Provider";
import CharityABI from '../contracts/Charity_abi.json';
import CharityCard from "../components/CharityCard";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Charity = ({ contractAddress }) => {
    const {
        web3,
    } = useWeb3();

    const [state, setState] = useState({
        name: "",
        minimumContribution: 0,
        approversCount: 0,
    });

    useEffect(() => {
        (async () => {
            const singleCharityContract = new web3.eth.Contract(
                CharityABI,
                contractAddress,
            );
            const nextState = {
                name: await singleCharityContract.methods.name().call(),
                minimumContribution: await singleCharityContract.methods.minimumContribution().call(),
                approversCount: await singleCharityContract.methods.approversCount().call(),
            };

            setState(nextState);
        })();
    }, [contractAddress, setState]);

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {state.name}
                </Typography>
                <Box mt={4} />
                <Typography variant="body2" component="p">
                    Minimum contribution ammount : {state.minimumContribution}
                </Typography>
                <Typography variant="body2" component="p">
                    Total approvers : {state.approversCount}
                </Typography>
            </CardContent>
            <CardActions>
                <Link to={`/charities/${contractAddress}`}>
                    <Button size="small">Open</Button>
                </Link>
            </CardActions>
        </Card>
    )
}

const ListCharitiesPage = () => {
    const {
        charityContract,
    } = useWeb3();
    const [charities, setCharities] = useState([]);

    useEffect(() => {
        (async () => {
            const deployedCharities = await charityContract.methods.getDeployedCampaigns().call();
            setCharities(deployedCharities);
        })();
    }, []);

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={4}>
                {charities.map((contractAddress, index) => (
                    <Grid item key={`charity-${index}`} xs={12} sm={6} md={4}>
                        <Charity contractAddress={contractAddress} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ListCharitiesPage;