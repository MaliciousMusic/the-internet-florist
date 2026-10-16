// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Bouquets for a local test network only (anvil): the reads of IBelaiBouquets the desktop app uses
///        (ownerOf, bouquet, recipe, the Transfer event) and a free mint. Never deployed on a public network.
contract BouquetsEssai {
    struct Bouquet {
        address creator;
        uint40 createdAt;
        uint16 vaseId;
    }

    struct Recipe {
        uint256[] skuIds;
        uint256[] amounts;
        bytes32 seed;
    }

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    error NotOwner();
    error NoSuchBouquet();

    mapping(uint256 => address) private _owners;
    mapping(uint256 => Bouquet) private _bouquets;
    mapping(uint256 => Recipe) private _recipes;
    uint256 public totalComposed;

    function mint(address to, uint40 createdAt, uint16 vaseId, bytes32 seed, uint256[] calldata skuIds, uint256[] calldata amounts)
        external
        returns (uint256 id)
    {
        id = ++totalComposed;
        _owners[id] = to;
        _bouquets[id] = Bouquet(msg.sender, createdAt, vaseId);
        _recipes[id] = Recipe(skuIds, amounts, seed);
        emit Transfer(address(0), to, id);
    }

    function ownerOf(uint256 id) public view returns (address o) {
        o = _owners[id];
        if (o == address(0)) revert NoSuchBouquet();
    }

    function transferFrom(address from, address to, uint256 id) external {
        if (ownerOf(id) != from || msg.sender != from) revert NotOwner();
        _owners[id] = to;
        emit Transfer(from, to, id);
    }

    function bouquet(uint256 id) external view returns (Bouquet memory) {
        ownerOf(id);
        return _bouquets[id];
    }

    function recipe(uint256 id) external view returns (Recipe memory) {
        ownerOf(id);
        return _recipes[id];
    }
}
