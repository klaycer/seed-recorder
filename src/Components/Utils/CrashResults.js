import CryptoJS from 'crypto-js';

class CrashResults{

    constructor(clientSeed, serverSeed, fisrtNonce, lastNonce, targets){
        this.clientSeed = clientSeed || '';
        this.serverSeed = serverSeed || '';
        this.targets = targets || [];
        this.results = {};
        this.targetResults = {};
        this.nonces = Array.from({length: (lastNonce - fisrtNonce)}, (v, k) => k+1);
    }   


    async generateResults(serverSeed, clientSeed){
        return await new Promise((resolve, reject) => {
            let hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, serverSeed);
            let r = hmacHasher.finalize(clientSeed).toString();
            let i = parseInt(r.substr(0, 8), 16);
            let a = Math.max(1, Math.pow(2, 32) / (i + 1) * .99);
            let finalResult = (Math.floor(100 * a) / 100);
            resolve(finalResult);
        });
    }


    async simulateTargets() {
        let nonce_len = this.nonces.length;
        let lastHash = '', hash = this.serverSeed
        for(let i = 0; i < nonce_len; i++){
            const nonce = this.nonces[i];
            let gamehash = (lastHash !== '' ? CryptoJS.SHA256(lastHash).toString() : hash);
            let currentResult = await this.generateResults(gamehash, this.clientSeed);
            this.results[nonce] = currentResult;
            lastHash = gamehash;
        }

        for(let k = 0; k < this.targets.length; k++){
            const target = this.targets[k];
            let hits = 0;
            for(let j in this.results){
                if(this.results[j] >= target)
                    hits += 1;
            }
            const expectedHitRate = parseFloat((((100/target) * 0.99) / 100).toFixed(7));
            const hitRate = parseFloat((hits / nonce_len).toFixed(7));
            const expectedHits = parseFloat((expectedHitRate * nonce_len).toFixed(7));
            const expectedHitsVsHits = parseFloat((hits - expectedHits).toFixed(7));
            const expectedHitRateVsHitRate =  parseFloat((hitRate - expectedHitRate).toFixed(7));

            this.targetResults[target] = {
                expectedHitRate: expectedHitRate,
                hitRate: hitRate,
                expectedHits: expectedHits,
                hits: hits,
                expectedHitsVsHits: expectedHitsVsHits,
                expectedHitRateVsHitRate: expectedHitRateVsHitRate
            }
        }
    }
}

export default CrashResults