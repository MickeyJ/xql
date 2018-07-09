import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised);

export generateQueries from './generateQueries'
export Cache from './Cache'
export const expect = chai.expect;
export const assert = chai.assert;
