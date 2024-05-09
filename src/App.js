import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Web3 from 'web3';

// Define as ABI e os endereços dos contratos aqui
const transferContractABI = []; // ABI do Contrato de Transferência
const oracleContractABI = []; // ABI do Contrato Oracle
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Conexão Web3

const transferContractAddress = '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db'; // Endereço do Contrato de Transferência
const oracleContractAddress = '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db'; // Endereço do Contrato Oracle

const transferContract = new web3.eth.Contract(transferContractABI, transferContractAddress);
const oracleContract = new web3.eth.Contract(oracleContractABI, oracleContractAddress);

function InterbankTransfer() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [checkAccount, setCheckAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState('');

  // Função para transferir dinheiro entre contas
  const transferMoney = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await transferContract.methods.transferFunds(fromAccount, toAccount, web3.utils.toWei(amount, 'ether')).send({ from: web3.eth.defaultAccount });
      setError("Transferência realizada com sucesso!");
    } catch (error) {
      setError("Erro ao transferir fundos: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar saldo da conta
  const checkBalance = async () => {
    setError(null);
    try {
      const accountBalance = await web3.eth.getBalance(checkAccount);
      setBalance(web3.utils.fromWei(accountBalance, 'ether') + ' ETH');
    } catch (error) {
      setError("Erro ao verificar saldo: " + error.message);
    }
  };

  return (
    <div className="App">
      <Card style={{ width: '25rem', margin: 'auto', marginTop: '50px' }}>
        <Card.Body>
          <Card.Title>Transferência de Dinheiro Interbancário</Card.Title>
          <Form>
            <Form.Group controlId="fromAccount">
              <Form.Label>Conta de Origem</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Endereço da Conta de Origem" 
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="toAccount">
              <Form.Label>Conta de Destino</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Endereço da Conta de Destino" 
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Valor (ETH)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Quantidade em ETH" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={transferMoney}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Transferir"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Formulário para verificar saldo da conta */}
      <Card style={{ width: '25rem', margin: 'auto', marginTop: '20px' }}>
        <Card.Body>
          <Card.Title>Verificar Saldo da Conta</Card.Title>
          <Form>
            <Form.Group controlId="checkAccount">
              <Form.Label>Endereço da Conta</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Endereço da Conta" 
                value={checkAccount}
                onChange={(e) => setCheckAccount(e.target.value)}
              />
            </Form.Group>

            <Button variant="info" onClick={checkBalance}>
              Verificar Saldo
            </Button>

            {/* Exibir saldo */}
            {balance && <Alert variant="success" style={{ marginTop: '20px' }}>Saldo: {balance}</Alert>}
          </Form>
        </Card.Body>
      </Card>

      {/* Exibição de erros */}
      {error && <Alert variant="danger" style={{ marginTop: '20px' }}>{error}</Alert>}
    </div>
  );
}

export default InterbankTransfer;
