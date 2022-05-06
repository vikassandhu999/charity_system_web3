import * as React from 'react'
import CharityCreatorABI from "./contracts/CharityCreator_abi.json";
import getWeb3 from "./getWeb3";

const CharityCreator_Address = '0xd5f24d30C6005253Bf13Ae070C2852bE598Dd800';

const Web3Context = React.createContext()

function stateReducer(
    state,
    updateState
) {
    return {
        ...state,
        ...(typeof updateState === 'function' ? updateState(state) : updateState)
    };
}

const initialState = {
    web3: null,
    account: null,
    charityContract: null,
    isLoadingWeb3: true,
    web3Error: null,
    isCharityManager: false,
};

function Web3Provider({ children }) {
    const [state, setState] = React.useReducer(stateReducer, initialState);

    const loadWeb3 = React.useCallback(async () => {
        try {
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();

            const instance = new web3.eth.Contract(
                CharityCreatorABI,
                CharityCreator_Address,
            );

            const contractOwner = await instance.methods.owner().call();

            console.log({ contractOwner, account: accounts[0] });

            setState({
                web3,
                account: accounts[0],
                charityContract: instance,
                isLoadingWeb3: false,
                web3Error: null,
                isCharityManager: contractOwner === accounts[0]
            });
        } catch (error) {
            console.error(error);
            setState({ isLoadingWeb3: false, web3Error: "Failed to load web3, accounts, or contract. Check console for details." });
        }
    }, [setState]);

    React.useEffect(() => {
        loadWeb3();
    }, [loadWeb3]);

    return <Web3Context.Provider value={state}>{children}</Web3Context.Provider>
}


export function useWeb3() {
    const context = React.useContext(Web3Context);
    if (context === undefined) {
        throw new Error(`useWeb3 must be used within a Web3Provider`);
    }
    return context;
}


export default Web3Provider;