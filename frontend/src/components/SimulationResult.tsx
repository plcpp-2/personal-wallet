import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface SimulationResultProps {
  result: {
    success: boolean
    gasLimit: string
    estimatedFee: string
    totalCost: string
    error?: string
  }
  onConfirm: (to: string, amount: string) => void
}

export function SimulationResult({ result, onConfirm }: SimulationResultProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center">
        {result.success ? (
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
        ) : (
          <XCircleIcon className="w-8 h-8 text-red-500" />
        )}
        <h2 className="ml-3 text-lg font-medium text-gray-900">
          Simulation {result.success ? 'Successful' : 'Failed'}
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {result.success ? (
          <>
            <div className="flex justify-between px-4 py-3 text-sm bg-gray-50 rounded-lg">
              <span className="text-gray-500">Gas Limit</span>
              <span className="font-medium text-gray-900">{result.gasLimit}</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm bg-gray-50 rounded-lg">
              <span className="text-gray-500">Estimated Fee</span>
              <span className="font-medium text-gray-900">{result.estimatedFee} ETH</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm bg-gray-50 rounded-lg">
              <span className="text-gray-500">Total Cost</span>
              <span className="font-medium text-gray-900">{result.totalCost} ETH</span>
            </div>

            <button
              onClick={() => onConfirm(result.to, result.amount)}
              className="flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500"
            >
              Confirm and Send
            </button>
          </>
        ) : (
          <div className="px-4 py-3 text-sm text-red-700 bg-red-50 rounded-lg">
            {result.error || 'Simulation failed. Please check your inputs and try again.'}
          </div>
        )}
      </div>
    </div>
  )
}
