// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./MemeNFT.sol";

contract MemeMarketplace is ReentrancyGuard, Ownable {
    MemeNFT public memeNFT;
    
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 listedAt;
    }
    
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingWithdrawals;
    
    uint256 public marketplaceFee = 250; // 2.5%
    uint256 public constant MAX_FEE = 1000; // 10%
    
    event ItemListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event AuctionCreated(uint256 indexed tokenId, address indexed seller, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 amount);
    
    constructor(address _memeNFT) {
        memeNFT = MemeNFT(_memeNFT);
    }
    
    function listItem(uint256 tokenId, uint256 price) external nonReentrant {
        require(memeNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(memeNFT.getApproved(tokenId) == address(this) || 
                memeNFT.isApprovedForAll(msg.sender, address(this)), "Not approved");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].active, "Already listed");
        require(!auctions[tokenId].active, "Item is in auction");
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            listedAt: block.timestamp
        });
        
        emit ItemListed(tokenId, msg.sender, price);
    }
    
    function buyItem(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Item not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        address seller = listing.seller;
        uint256 price = listing.price;
        
        listing.active = false;
        
        // Calculate fees and royalties
        (address royaltyRecipient, uint256 royaltyAmount) = memeNFT.royaltyInfo(tokenId, price);
        uint256 marketplaceFeeAmount = (price * marketplaceFee) / 10000;
        uint256 sellerAmount = price - royaltyAmount - marketplaceFeeAmount;
        
        // Transfer NFT
        memeNFT.safeTransferFrom(seller, msg.sender, tokenId);
        
        // Distribute payments
        if (royaltyAmount > 0 && royaltyRecipient != seller) {
            pendingWithdrawals[royaltyRecipient] += royaltyAmount;
        } else {
            sellerAmount += royaltyAmount;
        }
        
        pendingWithdrawals[seller] += sellerAmount;
        pendingWithdrawals[owner()] += marketplaceFeeAmount;
        
        // Refund excess payment
        if (msg.value > price) {
            pendingWithdrawals[msg.sender] += msg.value - price;
        }
        
        emit ItemSold(tokenId, msg.sender, seller, price);
    }
    
    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Item not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        
        emit ListingCancelled(tokenId, msg.sender);
    }
    
    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external nonReentrant {
        require(memeNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(memeNFT.getApproved(tokenId) == address(this) || 
                memeNFT.isApprovedForAll(msg.sender, address(this)), "Not approved");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(duration >= 1 hours && duration <= 7 days, "Invalid duration");
        require(!listings[tokenId].active, "Item is listed for sale");
        require(!auctions[tokenId].active, "Auction already active");
        
        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentBid: 0,
            currentBidder: address(0),
            endTime: block.timestamp + duration,
            active: true
        });
        
        emit AuctionCreated(tokenId, msg.sender, startingPrice, block.timestamp + duration);
    }
    
    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.currentBid, "Bid too low");
        require(msg.value >= auction.startingPrice, "Below starting price");
        
        // Refund previous bidder
        if (auction.currentBidder != address(0)) {
            pendingWithdrawals[auction.currentBidder] += auction.currentBid;
        }
        
        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;
        
        emit BidPlaced(tokenId, msg.sender, msg.value);
    }
    
    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction still ongoing");
        
        auction.active = false;
        
        if (auction.currentBidder != address(0)) {
            // Calculate fees and royalties
            (address royaltyRecipient, uint256 royaltyAmount) = memeNFT.royaltyInfo(tokenId, auction.currentBid);
            uint256 marketplaceFeeAmount = (auction.currentBid * marketplaceFee) / 10000;
            uint256 sellerAmount = auction.currentBid - royaltyAmount - marketplaceFeeAmount;
            
            // Transfer NFT to winner
            memeNFT.safeTransferFrom(auction.seller, auction.currentBidder, tokenId);
            
            // Distribute payments
            if (royaltyAmount > 0 && royaltyRecipient != auction.seller) {
                pendingWithdrawals[royaltyRecipient] += royaltyAmount;
            } else {
                sellerAmount += royaltyAmount;
            }
            
            pendingWithdrawals[auction.seller] += sellerAmount;
            pendingWithdrawals[owner()] += marketplaceFeeAmount;
            
            emit AuctionEnded(tokenId, auction.currentBidder, auction.currentBid);
        }
    }
    
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    function setMarketplaceFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_FEE, "Fee too high");
        marketplaceFee = _fee;
    }
    
    function getActiveListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
    
    function getActiveAuction(uint256 tokenId) external view returns (Auction memory) {
        return auctions[tokenId];
    }
}
