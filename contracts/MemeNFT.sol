// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MemeNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Royalty information
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royaltyPercentage;
    
    // Meme metadata
    struct MemeData {
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 likes;
        bool isRemix;
        uint256 originalTokenId;
    }
    
    mapping(uint256 => MemeData) public memeData;
    mapping(uint256 => address[]) public likedBy;
    mapping(address => mapping(uint256 => bool)) public hasLiked;
    
    // Events
    event MemeMinted(uint256 indexed tokenId, address indexed creator, string title);
    event MemeLiked(uint256 indexed tokenId, address indexed liker);
    event MemeRemixed(uint256 indexed newTokenId, uint256 indexed originalTokenId, address indexed remixer);
    
    constructor() ERC721("MemeMint NFT", "MEME") {}
    
    function mintMeme(
        string memory title,
        string memory description,
        string memory tokenURI,
        uint256 _royaltyPercentage,
        bool isRemix,
        uint256 originalTokenId
    ) public returns (uint256) {
        require(_royaltyPercentage <= 1000, "Royalty cannot exceed 10%"); // 1000 = 10%
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        creators[tokenId] = msg.sender;
        royaltyPercentage[tokenId] = _royaltyPercentage;
        
        memeData[tokenId] = MemeData({
            title: title,
            description: description,
            creator: msg.sender,
            createdAt: block.timestamp,
            likes: 0,
            isRemix: isRemix,
            originalTokenId: originalTokenId
        });
        
        emit MemeMinted(tokenId, msg.sender, title);
        
        if (isRemix && originalTokenId < tokenId) {
            emit MemeRemixed(tokenId, originalTokenId, msg.sender);
        }
        
        return tokenId;
    }
    
    function likeMeme(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(!hasLiked[msg.sender][tokenId], "Already liked this meme");
        
        hasLiked[msg.sender][tokenId] = true;
        likedBy[tokenId].push(msg.sender);
        memeData[tokenId].likes++;
        
        emit MemeLiked(tokenId, msg.sender);
    }
    
    function getMemeData(uint256 tokenId) public view returns (MemeData memory) {
        require(_exists(tokenId), "Token does not exist");
        return memeData[tokenId];
    }
    
    function getLikers(uint256 tokenId) public view returns (address[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return likedBy[tokenId];
    }
    
    function royaltyInfo(uint256 tokenId, uint256 salePrice) 
        external 
        view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        require(_exists(tokenId), "Token does not exist");
        receiver = creators[tokenId];
        royaltyAmount = (salePrice * royaltyPercentage[tokenId]) / 10000;
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
