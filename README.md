# Personal Wallet

A modern web3 wallet application built with Next.js, Wagmi, and Base network integration.

## Features

- Connect with MetaMask and Coinbase Wallet
- View wallet balance and transaction history
- Send transactions on Base network
- Transaction simulation before sending
- Support for Base Mainnet and Base Sepolia networks

## Tech Stack

- Next.js 14
- TypeScript
- Wagmi/Viem for Ethereum interactions
- TailwindCSS for styling
- Jest for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or Coinbase Wallet browser extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/plcpp-2/personal-wallet.git
cd personal-wallet
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your values:
- `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key
- `NEXT_PUBLIC_BASE_RPC_URL`: Base Mainnet RPC URL
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`: Base Sepolia RPC URL

### Development

Run the development server:
```bash
npm run dev
```

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Building

Build for production:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── app/          # Next.js app router components
│   ├── components/   # React components
│   ├── config/       # Configuration files
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript type definitions
│   └── test/         # Test utilities
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
