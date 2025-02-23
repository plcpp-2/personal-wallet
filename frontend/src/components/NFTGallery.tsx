import { useEffect } from 'react'
import { useWallet } from '@/hooks/useWallet'
import Image from 'next/image'

interface NFTGalleryProps {
  network?: 'mainnet' | 'sepolia'
}

export const NFTGallery = ({ network = 'mainnet' }: NFTGalleryProps) => {
  const { nfts, loadNFTs, isConnected } = useWallet()

  useEffect(() => {
    if (isConnected) {
      loadNFTs(network)
    }
  }, [isConnected, loadNFTs, network])

  if (!isConnected) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">NFT Collection</h2>
      {nfts.length === 0 ? (
        <p className="text-gray-500">No NFTs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft, index) => (
            <div
              key={`${nft.tokenId}-${index}`}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                {nft.media?.[0]?.gateway ? (
                  <Image
                    src={nft.media[0].gateway}
                    alt={nft.title || 'NFT'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate">
                  {nft.title || 'Untitled NFT'}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {nft.description || 'No description'}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    #{nft.tokenId}
                  </span>
                  <span className="text-xs text-gray-500">
                    {nft.contract?.name || 'Unknown Collection'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
