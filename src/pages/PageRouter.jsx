import React from "react";
import { Container } from "@chakra-ui/react";

import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import ListCharitiesPage from "./ListCharities";
import CreateCharity from "./CreateCharity";
import SingleCharity from "./SingleCharity";
import MainHeader from "../components/Header";
import Charity from "./Charity";

const PageRouter = () => {
    return (
        <Container maxW='100vw' p={0}>
            <MainHeader />
            <Routes>
                <Route path="/" element={<ListCharitiesPage />} />
                <Route path="/charities" element={<ListCharitiesPage />} />
                <Route path="/charities/:address" element={<Charity />} />
                <Route path="/create-charity" element={<CreateCharity />} />
            </Routes>
        </Container>

    )
}

export default PageRouter;