import React, { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "../Web3Provider";
import CharityABI from '../contracts/Charity_abi.json';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Chip, Divider, Grid, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const CreateRequestForm = ({ submitting, onRequestCreate }) => {
    const [description, setDescription] = useState("");
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);

    return (
        <Box p={4}>
            <Box mt={2} />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.currentTarget.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="amount"
                        name="minamountAcount"
                        label="Requested amount"
                        fullWidth
                        type={'number'}
                        variant="standard"
                        value={amount}
                        onChange={(e) => setAmount(e.currentTarget.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="recipient"
                        name="recipient"
                        label="Recipient wallet address"
                        fullWidth
                        variant="standard"
                        value={recipient}
                        onChange={(e) => setRecipient(e.currentTarget.value)}
                    />
                </Grid>
                <Box mt={4} />
                <Grid item xs={12}>
                    <Button disabled={submitting} onClick={() => onRequestCreate({ description, recipient, amount })} variant="contained">Create</Button>
                </Grid>
            </Grid>
        </Box >
    )
}


const CreateRequest = ({ setTab, contractAddress }) => {
    const { web3, account } = useWeb3();
    const [submitting, setSubmitting] = useState(false);

    const onRequestCreate = React.useCallback(async (values) => {
        setSubmitting(true);
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
        setSubmitting(false);
        setTab("requests");
    }, [web3, contractAddress, account, setSubmitting, setTab]);

    return <CreateRequestForm onRequestCreate={onRequestCreate} submitting={submitting} />
}


const Donate = ({ setTab, contractAddress }) => {
    const { web3, account } = useWeb3();
    const [amount, setAmount] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const onCreateDonation = React.useCallback(async (values) => {
        setSubmitting(true);
        const singleCharityContract = new web3.eth.Contract(
            CharityABI,
            contractAddress,
        );
        await singleCharityContract.methods.contribute().send({ from: account, value: values.amount });
        setSubmitting(false);
        setTab("requests");
    }, [web3.eth.Contract, contractAddress, account, setTab]);

    return <Box p={4}>
        <Box mt={2} />
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="amount"
                    name="amount"
                    label="Amount"
                    fullWidth
                    type={'number'}
                    variant="standard"
                    value={amount}
                    onChange={(e) => setAmount(e.currentTarget.value)}
                />
            </Grid>
            <Box mt={4} />
            <Grid item xs={12}>
                <Button disabled={submitting} onClick={() => onCreateDonation({ amount })} variant="contained">Donate</Button>
            </Grid>
        </Grid>
    </Box >
}

const ListAllRequests = ({ contractAddress }) => {
    const { web3, account } = useWeb3();
    const [requests, setRequests] = useState([]);
    const [approval, setApproval] = useState(false);

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

            setRequests(_requests);

            const canBeApproval = await singleCharityContract.methods.canPersonApprove(account).call();
            if (canBeApproval !== approval) {
                setApproval(canBeApproval);
            }
        })();
    }, [web3, contractAddress, setRequests, account, approval]);

    return (
        <List>
            {requests.length === 0 && <Box p={2}>
                <Typography>
                    No requests found
                </Typography>
            </Box>}
            {requests.map((request, index) => {
                return (
                    <SingleRequest request={request} index={index} contractAddress={contractAddress} approval={approval} />
                )
            })}
        </List>
    )
}

const SingleRequest = ({ request, index, contractAddress, approval }) => {
    const { web3, account, isCharityManager } = useWeb3();
    const [donated, setDonated] = useState(false);

    const [finalised, setFinalised] = useState(false);

    const approveRequest = React.useCallback(async (index) => {
        const singleCharityContract = new web3.eth.Contract(
            CharityABI,
            contractAddress,
        );
        await singleCharityContract.methods.approveRequest(index).send({ from: account });
        setDonated(!donated);
    }, [web3.eth.Contract, contractAddress, account, donated]);

    const finaliseRequest = React.useCallback(async (index) => {
        const singleCharityContract = new web3.eth.Contract(
            CharityABI,
            contractAddress,
        );
        await singleCharityContract.methods.finalizeRequest(index).send({ from: account });
        setDonated(!finalised);
    }, [web3.eth.Contract, contractAddress, account, finalised]);

    const createFunctionalityButton = useCallback((index) => {
        const singleCharityContract = new web3.eth.Contract(
            CharityABI,
            contractAddress,
        );
        singleCharityContract.methods.checkIfAddressExists(account, index)
            .call()
            .then(isDonated => { if (donated != isDonated) setDonated(isDonated); })
            .catch(error => { console.log(error) });
        singleCharityContract.methods.checkIfRequestFinalised(index)
            .call()
            .then(canBeFinalised => { if (canBeFinalised != finalised) setFinalised(canBeFinalised); })
            .catch(error => { console.log(error) });

        if (isCharityManager) {
            if (finalised) {
             //   return <Button size="small" variant="outlined">Requests finalised!</Button>;
            } else {
                return <Button size="small" variant="outlined" onClick={() => finaliseRequest(index)}>Finalise requests</Button>;
            }
        } else {
            if (donated) {
                return <Button size="small" variant="">Approved</Button>
            } else if (approval) {
                return <Button size="small" variant="outlined" onClick={() => approveRequest(index)}>Approve</Button>
            } else {
                return <Button size="small" disabled variant="outlined">Donate to approve request</Button>
            }
        }
    }, [account, approval, approveRequest, contractAddress, donated, finaliseRequest, finalised, isCharityManager, web3.eth.Contract]);

    return (
        <>
            <ListItem key={`request-list-${index}`} alignItems="flex-start">
                <ListItemText
                    primary={request.description}
                    secondary={
                        <Box p={1} display="flex" justifyContent={'space-between'} alignItems="center">
                            <Typography>
                                Amount : {request.value}
                            </Typography>
                            {
                                finalised ? <Chip label="Completed" color="primary" variant="outlined" /> :
                                    <Chip label="Pending approval" color="success" variant="outlined" />
                            }
                        </Box>
                    }
                />
                {createFunctionalityButton(index)}
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    )
}

const ChairtyLoader = ({ contractAddress }) => {
    const [value, setValue] = React.useState('requests');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { web3, account, isCharityManager } = useWeb3();
    const [name, setName] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);

    useEffect(() => {
        (async () => {
            const singleCharityContract = new web3.eth.Contract(
                CharityABI,
                contractAddress,
            );
            const _name = await singleCharityContract.methods.name().call();
            const _donated = await singleCharityContract.methods.getCurrentAmount().call();

            setName(_name);
            setCurrentBalance(_donated);
        })();
    }, [web3, contractAddress, setName, setCurrentBalance]);

    return (
        <Box sx={{ maxWidth: '600px', width: '100%', marginTop: '60px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Box py={2} px={1}>
                <Typography>Charity name : {name}</Typography>
                <Typography>Current balance : {currentBalance}</Typography>
            </Box>
            <Paper>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="requests" label="Requests" />
                    <Tab value="action" label={isCharityManager ? "Create request" : "Make donation"} />
                </Tabs>
                <Box>
                    {value === "requests" && <ListAllRequests contractAddress={contractAddress} />}
                    {value === "action" && isCharityManager && <CreateRequest setTab={setValue} contractAddress={contractAddress} />}
                    {value === "action" && !isCharityManager && <Donate setTab={setValue} contractAddress={contractAddress} />}
                </Box>
            </Paper>
        </Box>
    );
}

export default function Charity() {
    const { address } = useParams();
    return <ChairtyLoader contractAddress={address} />

}