import crypto from 'crypto';

class LimboResults{

    constructor(clientSeed, serverSeed, fisrtNonce, lastNonce, targets){
        this.clientSeed = clientSeed || '';
        this.serverSeed = serverSeed || '';
        this.targets = targets || [];
        this.results = {};
        this.targetResults = {};
        this.nonces = Array.from({length: (lastNonce - fisrtNonce)}, (v, k) => k+1);
    }   


    async generateResults(serverSeed, clientSeed, nonce){
        return await new Promise((resolve, reject) => {
            const hmac = crypto.createHmac('sha256', `${serverSeed}`);
            hmac.update(`${clientSeed}:${nonce}:0`);
            const buffer = hmac.digest();
            const bytes = [];
            for (let i = 0; i < 5; i++) {
                const el = buffer[i];
                bytes.push(el);
            }
            const floats = [];
            floats.push(bytes[0] / 256);
            floats.push(bytes[1] / (256 ** 2));
            floats.push(bytes[2] / (256 ** 3));
            floats.push(bytes[3] / (256 ** 4));

            const float = Math.floor((floats.reduce((a, b) => a + b, 0)) * 100000000);
            const result = 100000000 / (float + 1) * (1 - 0.01);
            const finalResult = Math.floor(result * 100) / 100;
            
            resolve(finalResult);
        });
    }

    async simulateTargets() {
        let nonce_len = this.nonces.length;

        for(let i = 0; i < nonce_len; i++){
            const nonce = this.nonces[i];
            let currentResult = await this.generateResults(this.serverSeed, this.clientSeed, nonce);
            this.results[nonce] = currentResult;
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

export default LimboResults