// SPDX-License-Identifier: BSD-3-Clause

/// @notice LootDAOLogicV1.sol is a modified version of Noun DAO's NounsDAOLogicV1.sol:
/// https://github.com/nounsDAO/nouns-monorepo/blob/76d6c267db40458a4ce06a9af063bbe7b160d3e3/packages/nouns-contracts/contracts/governance/NounsDAOLogicV1.sol

/// @title The Loot DAO logic version 1

pragma solidity ^0.8.6;

import "./LootDAOInterfaces.sol";

contract LootDAOLogicV1 is LootDAOStorageV1, LootDAOEvents {
    /// @notice The name of this contract
    string public constant name = "Loot DAO";

    /// @notice The minimum setable proposal threshold
    uint256 public constant MIN_PROPOSAL_THRESHOLD_BPS = 1; // 1 basis point or 0.01%

    /// @notice The maximum setable proposal threshold
    uint256 public constant MAX_PROPOSAL_THRESHOLD_BPS = 1_000; // 1,000 basis points or 10%

    /// @notice The minimum setable voting period
    uint256 public constant MIN_VOTING_PERIOD = 5_760; // About 24 hours

    /// @notice The max setable voting period
    uint256 public constant MAX_VOTING_PERIOD = 80_640; // About 2 weeks

    /// @notice The min setable voting delay
    uint256 public constant MIN_VOTING_DELAY = 1;

    /// @notice The max setable voting delay
    uint256 public constant MAX_VOTING_DELAY = 40_320; // About 1 week

    /// @notice The minimum setable quorum votes basis points
    uint256 public constant MIN_QUORUM_VOTES_BPS = 200; // 200 basis points or 2%

    /// @notice The maximum setable quorum votes basis points
    uint256 public constant MAX_QUORUM_VOTES_BPS = 2_000; // 2,000 basis points or 20%

    /// @notice The maximum number of actions that can be included in a proposal
    uint256 public constant proposalMaxOperations = 10; // 10 actions

    /// @notice The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
        );

    /// @notice The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH =
        keccak256(
            "Ballot(uint256 proposalId,uint256[] tokenIds,uint8 support)"
        );

    /**
     * @notice Used to initialize the contract during delegator contructor
     * @param timelock_ The address of the LootDAOExecutor
     * @param loot_ The address of the Loot token
     * @param vetoer_ The address allowed to unilaterally veto proposals
     * @param votingPeriod_ The initial voting period
     * @param votingDelay_ The initial voting delay
     * @param proposalThresholdBPS_ The initial proposal threshold in basis points
     * * @param quorumVotesBPS_ The initial quorum votes threshold in basis points
     */
    function initialize(
        address timelock_,
        address loot_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public virtual {
        require(
            address(timelock) == address(0),
            "LootDAO::initialize: can only initialize once"
        );
        require(msg.sender == admin, "LootDAO::initialize: admin only");
        require(
            timelock_ != address(0),
            "LootDAO::initialize: invalid timelock address"
        );
        require(
            loot_ != address(0),
            "LootDAO::initialize: invalid loot address"
        );
        require(
            votingPeriod_ >= MIN_VOTING_PERIOD &&
                votingPeriod_ <= MAX_VOTING_PERIOD,
            "LootDAO::initialize: invalid voting period"
        );
        require(
            votingDelay_ >= MIN_VOTING_DELAY &&
                votingDelay_ <= MAX_VOTING_DELAY,
            "LootDAO::initialize: invalid voting delay"
        );
        require(
            proposalThresholdBPS_ >= MIN_PROPOSAL_THRESHOLD_BPS &&
                proposalThresholdBPS_ <= MAX_PROPOSAL_THRESHOLD_BPS,
            "LootDAO::initialize: invalid proposal threshold"
        );
        require(
            quorumVotesBPS_ >= MIN_QUORUM_VOTES_BPS &&
                quorumVotesBPS_ <= MAX_QUORUM_VOTES_BPS,
            "LootDAO::initialize: invalid proposal threshold"
        );

        emit VotingPeriodSet(votingPeriod, votingPeriod_);
        emit VotingDelaySet(votingDelay, votingDelay_);
        emit ProposalThresholdBPSSet(
            proposalThresholdBPS,
            proposalThresholdBPS_
        );
        emit QuorumVotesBPSSet(quorumVotesBPS, quorumVotesBPS_);

        timelock = ILootDAOExecutor(timelock_);
        loot = IERC721Enumerable(loot_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }

    struct ProposalTemp {
        uint256 totalSupply;
        uint256 proposalThreshold;
        uint256 latestProposalId;
        uint256 startBlock;
        uint256 endBlock;
    }

    /**
     * @notice Function used to propose a new proposal. Sender must own tokens above the proposal threshold
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @return Proposal id of new proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        ProposalTemp memory temp;

        temp.totalSupply = loot.totalSupply();

        temp.proposalThreshold = bps2Uint(
            proposalThresholdBPS,
            temp.totalSupply
        );

        require(
            loot.balanceOf(msg.sender) > temp.proposalThreshold,
            "LootDAO::propose: proposer votes below proposal threshold"
        );
        require(
            targets.length == values.length &&
                targets.length == signatures.length &&
                targets.length == calldatas.length,
            "LootDAO::propose: proposal function information arity mismatch"
        );
        require(targets.length != 0, "LootDAO::propose: must provide actions");
        require(
            targets.length <= proposalMaxOperations,
            "LootDAO::propose: too many actions"
        );

        temp.latestProposalId = latestProposalIds[msg.sender];
        if (temp.latestProposalId != 0) {
            ProposalState proposersLatestProposalState = state(
                temp.latestProposalId
            );
            require(
                proposersLatestProposalState != ProposalState.Active,
                "LootDAO::propose: one live proposal per proposer, found an already active proposal"
            );
            require(
                proposersLatestProposalState != ProposalState.Pending,
                "LootDAO::propose: one live proposal per proposer, found an already pending proposal"
            );
        }

        temp.startBlock = block.number + votingDelay;
        temp.endBlock = temp.startBlock + votingPeriod;

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];

        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.proposalThreshold = temp.proposalThreshold;
        newProposal.quorumVotes = bps2Uint(quorumVotesBPS, temp.totalSupply);
        newProposal.eta = 0;
        newProposal.targets = targets;
        newProposal.values = values;
        newProposal.signatures = signatures;
        newProposal.calldatas = calldatas;
        newProposal.startBlock = temp.startBlock;
        newProposal.endBlock = temp.endBlock;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.canceled = false;
        newProposal.executed = false;
        newProposal.vetoed = false;

        latestProposalIds[newProposal.proposer] = newProposal.id;

        /// @notice Maintains backwards compatibility with GovernorBravo events
        emit ProposalCreated(
            newProposal.id,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            description
        );

        /// @notice Updated event with `proposalThreshold` and `quorumVotes`
        emit ProposalCreatedWithRequirements(
            newProposal.id,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            newProposal.proposalThreshold,
            newProposal.quorumVotes,
            description
        );

        return newProposal.id;
    }

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(uint256 proposalId) external {
        require(
            state(proposalId) == ProposalState.Succeeded,
            "LootDAO::queue: proposal can only be queued if it is succeeded"
        );
        Proposal storage proposal = proposals[proposalId];
        uint256 eta = block.timestamp + timelock.delay();
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                eta
            );
        }
        proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) internal {
        require(
            !timelock.queuedTransactions(
                keccak256(abi.encode(target, value, signature, data, eta))
            ),
            "LootDAO::queueOrRevertInternal: identical proposal action already queued at eta"
        );
        timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(uint256 proposalId) external {
        require(
            state(proposalId) == ProposalState.Queued,
            "LootDAO::execute: proposal can only be executed if it is queued"
        );
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.executeTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer, or proposer balance dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(uint256 proposalId) external {
        require(
            state(proposalId) != ProposalState.Executed,
            "LootDAO::cancel: cannot cancel executed proposal"
        );

        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer ||
                loot.balanceOf(proposal.proposer) < proposal.proposalThreshold,
            "LootDAO::cancel: proposer above threshold"
        );

        proposal.canceled = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(uint256 proposalId) external {
        require(vetoer != address(0), "LootDAO::veto: veto power burned");
        require(msg.sender == vetoer, "LootDAO::veto: only vetoer");
        require(
            state(proposalId) != ProposalState.Executed,
            "LootDAO::veto: cannot veto executed proposal"
        );

        Proposal storage proposal = proposals[proposalId];

        proposal.vetoed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit ProposalVetoed(proposalId);
    }

    /**
     * @notice Gets actions of a proposal
     * @param proposalId the id of the proposal
     * @return targets
     * @return values
     * @return signatures
     * @return calldatas
     */
    function getActions(uint256 proposalId)
        external
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        )
    {
        Proposal storage p = proposals[proposalId];
        return (p.targets, p.values, p.signatures, p.calldatas);
    }

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId The id of proposal
     * @param tokenId The id of the token voted with
     * @return The voting receipt
     */
    function getReceipt(uint256 proposalId, uint256 tokenId)
        external
        view
        returns (Receipt memory)
    {
        return proposals[proposalId].receipts[tokenId];
    }

    /**
     * @notice Gets the state of a proposal
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(
            proposalCount >= proposalId,
            "LootDAO::state: invalid proposal id"
        );
        Proposal storage proposal = proposals[proposalId];
        if (proposal.vetoed) {
            return ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (
            proposal.forVotes <= proposal.againstVotes ||
            proposal.forVotes < proposal.quorumVotes
        ) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + timelock.GRACE_PERIOD()) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }

    /**
     * @notice Cast a vote for a proposal
     * @param proposalId The id of the proposal to vote on
     * @param tokenIds The id of the tokens to vote with
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     */
    function castVote(
        uint256 proposalId,
        uint256[] calldata tokenIds,
        uint8 support
    ) external {
        emit VoteCast(
            msg.sender,
            proposalId,
            tokenIds,
            support,
            castVoteInternal(msg.sender, proposalId, tokenIds, support),
            ""
        );
    }

    /**
     * @notice Cast a vote for a proposal with a reason
     * @param proposalId The id of the proposal to vote on
     * @param tokenIds The id of the tokens to vote with
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     */
    function castVoteWithReason(
        uint256 proposalId,
        uint256[] calldata tokenIds,
        uint8 support,
        string calldata reason
    ) external {
        emit VoteCast(
            msg.sender,
            proposalId,
            tokenIds,
            support,
            castVoteInternal(msg.sender, proposalId, tokenIds, support),
            reason
        );
    }

    /**
     * @notice Cast a vote for a proposal by signature
     * @dev External function that accepts EIP-712 signatures for voting on proposals.
     */
    function castVoteBySig(
        uint256 proposalId,
        uint256[] calldata tokenIds,
        uint8 support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // Avoid "Stack too deep" errors
        address signatory;
        {
            bytes32 domainSeparator = keccak256(
                abi.encode(
                    DOMAIN_TYPEHASH,
                    keccak256(bytes(name)),
                    getChainIdInternal(),
                    address(this)
                )
            );
            bytes32 structHash = keccak256(
                abi.encode(
                    BALLOT_TYPEHASH,
                    proposalId,
                    keccak256(abi.encodePacked(tokenIds)),
                    support
                )
            );
            bytes32 digest = keccak256(
                abi.encodePacked("\x19\x01", domainSeparator, structHash)
            );
            signatory = ecrecover(digest, v, r, s);
            require(
                signatory != address(0),
                "LootDAO::castVoteBySig: invalid signature"
            );
        }
        emit VoteCast(
            signatory,
            proposalId,
            tokenIds,
            support,
            castVoteInternal(signatory, proposalId, tokenIds, support),
            ""
        );
    }

    /**
     * @notice Internal function that caries out voting logic
     * @param voter The voter that is casting their vote
     * @param proposalId The id of the proposal to vote on
     * @param tokenIds The id of the tokens to vote with
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @return The number of votes cast
     */
    function castVoteInternal(
        address voter,
        uint256 proposalId,
        uint256[] memory tokenIds,
        uint8 support
    ) internal returns (uint96) {
        require(
            state(proposalId) == ProposalState.Active,
            "LootDAO::castVoteInternal: voting is closed"
        );
        require(support <= 2, "LootDAO::castVoteInternal: invalid vote type");
        Proposal storage proposal = proposals[proposalId];

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                loot.ownerOf(tokenIds[i]) == voter,
                "LootDAO::castVoteInternal: voter not owner of token"
            );

            Receipt storage receipt = proposal.receipts[tokenIds[i]];
            require(
                receipt.hasVoted == false,
                "LootDAO::castVoteInternal: token already voted"
            );

            receipt.hasVoted = true;
            receipt.voter = voter;
            receipt.support = support;
        }

        /// @notice: Unlike NounsDAOLogicV1, which governs a checkpointed token, we have to deal with governing
        /// the Loot token which is not checkpointed. To make sure no Loot token can vote more than once, casting
        /// a vote is to be explicitly tied to a token id. Batch voting methods exist for casting votes with
        /// multiple tokens in the same transaction.
        uint96 votes = uint96(tokenIds.length);

        if (support == 0) {
            proposal.againstVotes = proposal.againstVotes + votes;
        } else if (support == 1) {
            proposal.forVotes = proposal.forVotes + votes;
        } else if (support == 2) {
            proposal.abstainVotes = proposal.abstainVotes + votes;
        }

        return votes;
    }

    /**
     * @notice Admin function for setting the voting delay
     * @param newVotingDelay new voting delay, in blocks
     */
    function _setVotingDelay(uint256 newVotingDelay) external {
        require(msg.sender == admin, "LootDAO::_setVotingDelay: admin only");
        require(
            newVotingDelay >= MIN_VOTING_DELAY &&
                newVotingDelay <= MAX_VOTING_DELAY,
            "LootDAO::_setVotingDelay: invalid voting delay"
        );
        uint256 oldVotingDelay = votingDelay;
        votingDelay = newVotingDelay;

        emit VotingDelaySet(oldVotingDelay, votingDelay);
    }

    /**
     * @notice Admin function for setting the voting period
     * @param newVotingPeriod new voting period, in blocks
     */
    function _setVotingPeriod(uint256 newVotingPeriod) external {
        require(msg.sender == admin, "LootDAO::_setVotingPeriod: admin only");
        require(
            newVotingPeriod >= MIN_VOTING_PERIOD &&
                newVotingPeriod <= MAX_VOTING_PERIOD,
            "LootDAO::_setVotingPeriod: invalid voting period"
        );
        uint256 oldVotingPeriod = votingPeriod;
        votingPeriod = newVotingPeriod;

        emit VotingPeriodSet(oldVotingPeriod, votingPeriod);
    }

    /**
     * @notice Admin function for setting the proposal threshold basis points
     * @dev newProposalThresholdBPS must be greater than the hardcoded min
     * @param newProposalThresholdBPS new proposal threshold
     */
    function _setProposalThresholdBPS(uint256 newProposalThresholdBPS)
        external
    {
        require(
            msg.sender == admin,
            "LootDAO::_setProposalThresholdBPS: admin only"
        );
        require(
            newProposalThresholdBPS >= MIN_PROPOSAL_THRESHOLD_BPS &&
                newProposalThresholdBPS <= MAX_PROPOSAL_THRESHOLD_BPS,
            "LootDAO::_setProposalThreshold: invalid proposal threshold"
        );
        uint256 oldProposalThresholdBPS = proposalThresholdBPS;
        proposalThresholdBPS = newProposalThresholdBPS;

        emit ProposalThresholdBPSSet(
            oldProposalThresholdBPS,
            proposalThresholdBPS
        );
    }

    /**
     * @notice Admin function for setting the quorum votes basis points
     * @dev newQuorumVotesBPS must be greater than the hardcoded min
     * @param newQuorumVotesBPS new proposal threshold
     */
    function _setQuorumVotesBPS(uint256 newQuorumVotesBPS) external {
        require(msg.sender == admin, "LootDAO::_setQuorumVotesBPS: admin only");
        require(
            newQuorumVotesBPS >= MIN_QUORUM_VOTES_BPS &&
                newQuorumVotesBPS <= MAX_QUORUM_VOTES_BPS,
            "LootDAO::_setProposalThreshold: invalid proposal threshold"
        );
        uint256 oldQuorumVotesBPS = quorumVotesBPS;
        quorumVotesBPS = newQuorumVotesBPS;

        emit QuorumVotesBPSSet(oldQuorumVotesBPS, quorumVotesBPS);
    }

    /**
     * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @param newPendingAdmin New pending admin.
     */
    function _setPendingAdmin(address newPendingAdmin) external {
        // Check caller = admin
        require(msg.sender == admin, "LootDAO::_setPendingAdmin: admin only");

        // Save current value, if any, for inclusion in log
        address oldPendingAdmin = pendingAdmin;

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;

        // Emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin)
        emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin);
    }

    /**
     * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
     * @dev Admin function for pending admin to accept role and update admin
     */
    function _acceptAdmin() external {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(
            msg.sender == pendingAdmin && msg.sender != address(0),
            "LootDAO::_acceptAdmin: pending admin only"
        );

        // Save current values for inclusion in log
        address oldAdmin = admin;
        address oldPendingAdmin = pendingAdmin;

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);

        emit NewAdmin(oldAdmin, admin);
        emit NewPendingAdmin(oldPendingAdmin, pendingAdmin);
    }

    /**
     * @notice Changes vetoer address
     * @dev Vetoer function for updating vetoer address
     */
    function _setVetoer(address newVetoer) public {
        require(msg.sender == vetoer, "LootDAO::_setVetoer: vetoer only");

        emit NewVetoer(vetoer, newVetoer);

        vetoer = newVetoer;
    }

    /**
     * @notice Burns veto priviledges
     * @dev Vetoer function destroying veto power forever
     */
    function _burnVetoPower() public {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == vetoer, "LootDAO::_burnVetoPower: vetoer only");

        _setVetoer(address(0));
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold() public view returns (uint256) {
        return bps2Uint(proposalThresholdBPS, loot.totalSupply());
    }

    /**
     * @notice Current quorum votes using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function quorumVotes() public view returns (uint256) {
        return bps2Uint(quorumVotesBPS, loot.totalSupply());
    }

    function bps2Uint(uint256 bps, uint256 number)
        internal
        pure
        returns (uint256)
    {
        return (number * bps) / 10000;
    }

    function getChainIdInternal() internal view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }
}
