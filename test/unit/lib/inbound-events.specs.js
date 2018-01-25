const { expect } = require('chai');
const { libs: { InboundMqEventHandler } } = require('../../modules');

describe('Test suite for inbound event handling', () => {

  let handler;
  beforeEach(() => {
    handler = new InboundMqEventHandler();
  });

  describe('Initialization test suite', () => {
    it('should initialize', () => {
      expect(handler).to.be.an.instanceOf(InboundMqEventHandler);
    });
  });

  describe('Partner employee related stories', () => {

    it('should throw if the event is missing is invalid', () => {
      const event = { rfid: 'aaa', name: 'adminAdded' };
      expect(() => { handler.handle(event); }).to.throw('invalid event content');
    });

    it('should throw if the event is missing the a value for rfid', () => {
      const event = { };
      expect(() => { handler.handle(event); }).to.throw('event is missing a rfid value');
    });

    it('should throw if the event name is missing', () => {
      const event = { rfid: 'aaa' };
      expect(() => { handler.handle(event); }).to.throw('event is missing a name');
    });

    it("should add to cashier's RFID to the list of cashiers", () => {

    });

    it('should add the RFID tag to the list of cashiers when the event comes in', () => {
      const event = { rfid: 'aaa', type: 'admin', entity: 'agent', name: 'cashierAdded' };
      // handler.handle(event);
    });
  });
});
