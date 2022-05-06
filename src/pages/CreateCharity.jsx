
import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from "../Web3Provider";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button, Paper } from "@mui/material";

const CreateCharityForm = ({ submitting, onSubmit }) => {
    const [name, setName] = useState("");
    const [minAmount, setMinAmount] = useState(0);

    return (
        <Box style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', marginTop: '60px' }} >
            <Paper>
                <Box p={4}>
                    <Typography variant="h6" gutterBottom>
                        Create charity
                    </Typography>
                    <Box mt={2} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                label="Charity name"
                                fullWidth
                                variant="standard"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="minAcount"
                                name="minAcount"
                                label="Minimum contribution amount"
                                fullWidth
                                type={'number'}
                                variant="standard"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.currentTarget.value)}
                            />
                        </Grid>
                        <Box mt={4} />
                        <Grid item xs={12}>
                            <Button variant="contained" disabled={submitting} onClick={() => onSubmit({ name, minAmount })}>Create</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}

{/* <Box p={4}>
<form onSubmit={(e) => {
    e.preventDefault();
    onSubmit({ name, minAmount });
}}>
    <FormControl>
        <FormLabel htmlFor='email'>Title</FormLabel>
        <Input id='name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
    </FormControl>
    <FormControl>
        <FormLabel htmlFor='email'>Minimum ammount per donation</FormLabel>
        <Input id='amount' type='number' value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
    </FormControl>
    <Button
        mt={4}
        colorScheme='teal'
        isLoading={submitting}
        type='submit'
    >
        Submit
    </Button>
</form>
</Box> */}

const CreateCharity = () => {
    const {
        account,
        charityContract } = useWeb3();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onSubmit = useCallback(async (values) => {
        setSubmitting(true);
        try {
            console.log({ values, account });
            await charityContract.methods.createCharity(values.name, values.minAmount).send({
                from: account,
            })
            setSubmitting(false);
            navigate('/charities');
        } catch (e) {
            setSubmitting(false)
        }
    }, [charityContract, account, navigate, setSubmitting]);

    return (
        <CreateCharityForm submitting={submitting} onSubmit={onSubmit} />
    );
}

export default CreateCharity;