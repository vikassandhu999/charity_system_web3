import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Provider';

export default function MainHeader() {
    const { isCharityManager } = useWeb3();
    return (
        <AppBar position="relative">
            <Container>
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    Authentic
                </Typography>

                <Box display={'flex'} justifyContent="center" alignItems="center" p={2}>
                    <Box px={2}>
                        <Link to="/charities" style={{ textDecoration: "none", color:"#111" }}> Charities </Link>
                    </Box>
                    {
                        isCharityManager && <Box px={2}>
                            <Link to="/create-charity" style={{ textDecoration: "none", color:"#111" }}> Create charity </Link>
                        </Box>
                    }
                </Box>
            </Toolbar>
            </Container>
        </AppBar>
    );
}