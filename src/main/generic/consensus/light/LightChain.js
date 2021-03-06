/**
 * A LightChain is initialized by using NiPoPoWs instead of the full
 * blockchain history, but after initialization, it behaves as a regular
 * full blockchain.
 */
class LightChain extends FullChain {
    /**
    * @param {JungleDB} jdb
    * @param {Accounts} accounts
    * @returns {Promise.<LightChain>}
    */
    static getPersistent(jdb, accounts) {
        const store = ChainDataStore.getPersistent(jdb);
        const chain = new LightChain(store, accounts);
        return chain._init();
    }

    /**
     * @param {Accounts} accounts
     * @returns {Promise.<LightChain>}
     */
    static createVolatile(accounts) {
        const store = ChainDataStore.createVolatile();
        const chain = new LightChain(store, accounts);
        return chain._init();
    }

    /**
     * @param {ChainDataStore} store
     * @param {Accounts} accounts
     * @returns {PartialLightChain}
     */
    constructor(store, accounts) {
        super(store, accounts);
    }

    /**
     * @override
     * @protected
     */
    async _init() {
        // FIXME: this is a workaround as Babel doesn't understand await super().
        await FullChain.prototype._init.call(this);
        if (!this._proof) {
            this._proof = await this._getChainProof();
        }
        return this;
    }

    async partialChain() {
        const proof = await this.getChainProof();
        const partialChain = new PartialLightChain(this._store, this._accounts, proof);
        partialChain.on('committed', async (proof, headHash, mainChain) => {
            this._proof = proof;
            this._headHash = headHash;
            this._mainChain = mainChain;
            this.fire('head-changed', this.head);
        });
        await partialChain._init();
        return partialChain;
    }
}
Class.register(LightChain);
