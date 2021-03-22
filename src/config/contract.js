import OnlineExam from '../abis/OnlineExam.json';
const address = '0xBFD1a555b4a356fEB06D31E6da92c18990Be5bfF';

export default async function Contract(){
    const web3 = window.web3
    const abi = OnlineExam.abi
    const contract = new web3.eth.Contract(abi, address)
    return contract;
}
